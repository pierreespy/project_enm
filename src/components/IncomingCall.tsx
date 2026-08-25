import React, { useEffect, useState } from 'react';
import { Modal, View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Svg, { Path } from 'react-native-svg';

/** Combiné iOS — décliné en version « raccrocher » par une simple rotation. */
function PhoneIcon({ size = 34, rotated = false }: { size?: number; rotated?: boolean }) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="#fff"
      style={rotated ? { transform: [{ rotate: '135deg' }] } : undefined}
    >
      <Path d="M6.6 2.3c.7 0 1.3.4 1.6 1l1.3 3a1.8 1.8 0 0 1-.5 2.1l-1.2 1a12.6 12.6 0 0 0 5.8 5.8l1-1.2a1.8 1.8 0 0 1 2.1-.5l3 1.3c.6.3 1 .9 1 1.6v2.9c0 1-.8 1.8-1.8 1.7C10.2 20.4 3.6 13.8 2.4 4.1 2.3 3.1 3.1 2.3 4.1 2.3z" />
    </Svg>
  );
}

/**
 * Easter egg — l'écran d'appel entrant de « John Pork », ouvert quand on tire
 * longtemps le Journal depuis le haut (voir hooks/useLongPullEasterEgg).
 *
 * La photo est `assets/john-pork.png` : remplacer ce fichier suffit à changer
 * l'appelant, tout le reste (nom, boutons) est dessiné ici.
 */
export function IncomingCall({
  visible,
  onDismiss,
  name = 'John Pork',
}: {
  visible: boolean;
  onDismiss: () => void;
  name?: string;
}) {
  const [answered, setAnswered] = useState(false);

  // Décrocher : l'appel « prend », puis se termine tout seul.
  useEffect(() => {
    if (!answered) return;
    const t = setTimeout(() => {
      setAnswered(false);
      onDismiss();
    }, 2600);
    return () => clearTimeout(t);
  }, [answered, onDismiss]);

  // Repartir d'un appel neuf à chaque ouverture.
  useEffect(() => {
    if (!visible) setAnswered(false);
  }, [visible]);

  const hangUp = () => {
    setAnswered(false);
    onDismiss();
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      supportedOrientations={['portrait']}
      onRequestClose={hangUp}
    >
      <View style={styles.root}>
        <StatusBar style="light" />
        <Image
          source={require('../../assets/john-pork.png')}
          style={StyleSheet.absoluteFill}
          resizeMode="cover"
        />
        <View style={styles.scrim} />

        <View style={styles.header}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.status}>
            {answered ? 'Appel en cours…' : 'est en train d’appeler…'}
          </Text>
        </View>

        <View style={styles.actions}>
          {answered ? (
            <View style={styles.action}>
              <Pressable
                style={[styles.circle, styles.decline]}
                onPress={hangUp}
                accessibilityRole="button"
                accessibilityLabel="Raccrocher"
              >
                <PhoneIcon rotated />
              </Pressable>
              <Text style={styles.actionLabel}>Raccrocher</Text>
            </View>
          ) : (
            <>
              <View style={styles.action}>
                <Pressable
                  style={[styles.circle, styles.decline]}
                  onPress={hangUp}
                  accessibilityRole="button"
                  accessibilityLabel="Refuser l’appel"
                >
                  <PhoneIcon rotated />
                </Pressable>
                <Text style={styles.actionLabel}>Refuser</Text>
              </View>
              <View style={styles.action}>
                <Pressable
                  style={[styles.circle, styles.accept]}
                  onPress={() => setAnswered(true)}
                  accessibilityRole="button"
                  accessibilityLabel="Accepter l’appel"
                >
                  <PhoneIcon />
                </Pressable>
                <Text style={styles.actionLabel}>Accepter</Text>
              </View>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000', justifyContent: 'space-between' },
  // Voile sombre en haut et en bas : le nom et les boutons restent lisibles
  // quelle que soit la photo.
  scrim: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.18)' },
  header: { alignItems: 'center', paddingTop: 96, paddingHorizontal: 24 },
  name: {
    fontSize: 42,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.35)',
    textShadowRadius: 12,
  },
  status: {
    fontSize: 21,
    color: 'rgba(255,255,255,0.92)',
    marginTop: 8,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.35)',
    textShadowRadius: 10,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'flex-end',
    paddingBottom: 72,
    paddingHorizontal: 28,
  },
  action: { alignItems: 'center', gap: 12 },
  circle: {
    width: 82,
    height: 82,
    borderRadius: 41,
    alignItems: 'center',
    justifyContent: 'center',
  },
  decline: { backgroundColor: '#ff3b30' },
  accept: { backgroundColor: '#34c759' },
  actionLabel: {
    fontSize: 16,
    color: '#fff',
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowRadius: 8,
  },
});
