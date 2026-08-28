import React, { useEffect, useRef, useState } from 'react';
import {
  Animated, Easing, Modal, View, Text, Image, Pressable, StyleSheet, useWindowDimensions,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Svg, { Path } from 'react-native-svg';
import { FadeIn } from './FadeIn';
import { heavy, medium, success } from '../lib/haptics';

const PHOTO = require('../../assets/john-pork.png');

// La photo EST l'interface : nom, sous-titre et boutons y sont déjà dessinés.
// On ne redessine donc rien par-dessus — on pose seulement deux zones tactiles
// invisibles à l'emplacement des boutons. Coordonnées relatives, mesurées sur
// l'image source (853 × 1844) : centre du bouton rouge, du bouton vert, et
// diamètre de la zone sensible (généreuse, ~1,2× le bouton visible).
const PHOTO_RATIO = 853 / 1844;
const DECLINE_X = 0.232;
const ACCEPT_X = 0.762;
const BUTTONS_Y = 0.786;
const HIT_SIZE = 0.28; // en fraction de la largeur affichée

/** Combiné iOS — utilisé seulement par l'écran « appel en cours ». */
function PhoneIcon({ size = 32 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="#fff" style={{ transform: [{ rotate: '135deg' }] }}>
      <Path d="M6.6 2.3c.7 0 1.3.4 1.6 1l1.3 3a1.8 1.8 0 0 1-.5 2.1l-1.2 1a12.6 12.6 0 0 0 5.8 5.8l1-1.2a1.8 1.8 0 0 1 2.1-.5l3 1.3c.6.3 1 .9 1 1.6v2.9c0 1-.8 1.8-1.8 1.7C10.2 20.4 3.6 13.8 2.4 4.1 2.3 3.1 3.1 2.3 4.1 2.3z" />
    </Svg>
  );
}

/**
 * Easter egg — l'écran d'appel entrant, ouvert quand on tire longtemps le
 * Journal depuis le haut (voir hooks/useLongPullEasterEgg).
 *
 * Refuser ferme. Accepter passe sur un écran « appel en cours » qui raccroche
 * de lui-même. Pour changer d'appelant : remplacer assets/john-pork.png — et
 * si le cadrage des boutons diffère, ajuster les constantes ci-dessus.
 */
export function IncomingCall({ visible, onDismiss }: { visible: boolean; onDismiss: () => void }) {
  const { width, height } = useWindowDimensions();
  const [answered, setAnswered] = useState(false);
  const entrance = useRef(new Animated.Value(0)).current;
  const ring = useRef(new Animated.Value(0)).current;

  // La photo est affichée en entier (jamais rognée) : les zones tactiles
  // restent alignées sur les boutons quel que soit le format de l'écran.
  const boxW = Math.min(width, height * PHOTO_RATIO);
  const boxH = boxW / PHOTO_RATIO;
  const hit = boxW * HIT_SIZE;
  const zone = (cx: number) => ({
    position: 'absolute' as const,
    left: cx * boxW - hit / 2,
    top: BUTTONS_Y * boxH - hit / 2,
    width: hit,
    height: hit,
    borderRadius: hit / 2,
  });

  useEffect(() => {
    if (!answered) return;
    const t = setTimeout(() => {
      setAnswered(false);
      onDismiss();
    }, 2600);
    return () => clearTimeout(t);
  }, [answered, onDismiss]);

  // L'écran arrive comme un appel : la photo tombe de haut en se posant.
  // Le Modal n'anime rien lui-même (animationType="none"), sinon son propre
  // fondu avalerait ce mouvement.
  useEffect(() => {
    if (!visible) {
      entrance.setValue(0);
      return;
    }
    Animated.spring(entrance, {
      toValue: 1,
      useNativeDriver: true,
      speed: 11,
      bounciness: 7,
    }).start();
  }, [entrance, visible]);

  // Et ça sonne aussi à l'écran : deux secousses brèves, en même temps que les
  // deux coups haptiques, puis repos — cadence d'un téléphone qui sonne.
  useEffect(() => {
    if (!visible || answered) {
      ring.setValue(0);
      return;
    }
    const shake = Animated.sequence([
      Animated.timing(ring, { toValue: 1, duration: 70, easing: Easing.linear, useNativeDriver: true }),
      Animated.timing(ring, { toValue: -1, duration: 140, easing: Easing.linear, useNativeDriver: true }),
      Animated.timing(ring, { toValue: 1, duration: 140, easing: Easing.linear, useNativeDriver: true }),
      Animated.timing(ring, { toValue: 0, duration: 70, easing: Easing.linear, useNativeDriver: true }),
      Animated.delay(1180),
    ]);
    const loop = Animated.loop(shake);
    loop.start();
    return () => loop.stop();
  }, [answered, ring, visible]);

  // Sonnerie haptique : deux coups rapprochés, puis silence — la cadence d'un
  // téléphone. Elle s'arrête dès que l'appel est pris ou refusé.
  useEffect(() => {
    if (!visible || answered) return;
    const ring = () => {
      heavy();
      setTimeout(heavy, 140);
    };
    ring();
    const id = setInterval(ring, 1600);
    return () => clearInterval(id);
  }, [answered, visible]);

  useEffect(() => {
    if (!visible) setAnswered(false);
  }, [visible]);

  const hangUp = () => {
    medium();
    setAnswered(false);
    onDismiss();
  };

  const answer = () => {
    success();
    setAnswered(true);
  };

  return (
    <Modal
      visible={visible}
      animationType="none"
      supportedOrientations={['portrait']}
      onRequestClose={hangUp}
    >
      <View style={styles.root}>
        <StatusBar style="light" />
        <Animated.View
          style={{
            width: boxW,
            height: boxH,
            opacity: entrance.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0, 1, 1] }),
            transform: [
              { scale: entrance.interpolate({ inputRange: [0, 1], outputRange: [0.86, 1] }) },
              {
                translateY: entrance.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-boxH * 0.06, 0],
                }),
              },
              {
                rotate: ring.interpolate({
                  inputRange: [-1, 1],
                  outputRange: ['-1.1deg', '1.1deg'],
                }),
              },
            ],
          }}
        >
          <Image source={PHOTO} style={styles.photo} resizeMode="contain" />

          {!answered && (
            <>
              <Pressable
                style={zone(DECLINE_X)}
                onPress={hangUp}
                accessibilityRole="button"
                accessibilityLabel="Refuser l’appel"
              />
              <Pressable
                style={zone(ACCEPT_X)}
                onPress={answer}
                accessibilityRole="button"
                accessibilityLabel="Accepter l’appel"
              />
            </>
          )}
        </Animated.View>

        {answered && (
          <FadeIn duration={220} distance={0} style={styles.inCall}>
            <Text style={styles.name}>John Pork</Text>
            <Text style={styles.status}>Appel en cours…</Text>
            <Pressable
              style={styles.hangUp}
              onPress={hangUp}
              accessibilityRole="button"
              accessibilityLabel="Raccrocher"
            >
              <PhoneIcon />
            </Pressable>
          </FadeIn>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000', alignItems: 'center', justifyContent: 'center' },
  photo: { width: '100%', height: '100%' },
  // Écran « appel en cours » : un voile sur la photo, pour ne pas laisser
  // cohabiter « est en train d'appeler… » (dessiné dans l'image) avec l'appel pris.
  inCall: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.78)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  name: { fontSize: 40, fontWeight: '600', color: '#fff' },
  status: { fontSize: 20, color: 'rgba(255,255,255,0.85)', marginBottom: 44 },
  hangUp: {
    width: 78,
    height: 78,
    borderRadius: 39,
    backgroundColor: '#ff3b30',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
