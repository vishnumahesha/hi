import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Alert,
} from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { colors, spacing, borderRadius } from '@/constants/theme';
import { Button } from '@/components';
import { PHOTO_TIPS } from '@/constants';
import { useAppStore } from '@/store/useAppStore';

export default function CaptureSidePhoto() {
  const router = useRouter();
  const cameraRef = useRef<CameraView>(null);
  const [facing, setFacing] = useState<CameraType>('front');
  const [permission, requestPermission] = useCameraPermissions();
  const [capturedUri, setCapturedUri] = useState<string | null>(null);

  const { setSidePhotoUri, frontPhotoUri } = useAppStore();

  const handleCapture = async () => {
    if (!cameraRef.current) return;

    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: false,
      });
      if (photo?.uri) {
        setCapturedUri(photo.uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to capture photo. Please try again.');
    }
  };

  const handlePickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [3, 4],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setCapturedUri(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const handleConfirm = () => {
    if (capturedUri) {
      setSidePhotoUri(capturedUri);
    }
    router.push('/review');
  };

  const handleSkip = () => {
    setSidePhotoUri(null);
    router.push('/review');
  };

  const handleRetake = () => {
    setCapturedUri(null);
  };

  // Check if we have front photo
  React.useEffect(() => {
    if (!frontPhotoUri) {
      router.replace('/capture-front');
    }
  }, [frontPhotoUri, router]);

  if (!permission?.granted) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.permissionContainer}>
          <Text style={styles.permissionIcon}>📷</Text>
          <Text style={styles.permissionTitle}>Camera Access Needed</Text>
          <Text style={styles.permissionText}>
            Grant camera access to capture your side profile photo.
          </Text>
          <Button
            title="Grant Access"
            onPress={requestPermission}
            size="large"
          />
          <TouchableOpacity onPress={handlePickImage} style={styles.altOption}>
            <Text style={styles.altOptionText}>Choose from gallery</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSkip} style={styles.skipOption}>
            <Text style={styles.skipOptionText}>Skip side photo</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (capturedUri) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Review Side Photo</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.previewContainer}>
          <Image source={{ uri: capturedUri }} style={styles.previewImage} />
        </View>

        <View style={styles.previewTips}>
          <Text style={styles.tipTitle}>Check your photo:</Text>
          <Text style={styles.tipItem}>✓ Profile is clearly visible</Text>
          <Text style={styles.tipItem}>✓ Ear and jaw line visible</Text>
          <Text style={styles.tipItem}>✓ Good lighting</Text>
        </View>

        <View style={styles.previewActions}>
          <Button
            title="Retake"
            onPress={handleRetake}
            variant="outline"
            fullWidth
          />
          <Button
            title="Use This Photo"
            onPress={handleConfirm}
            fullWidth
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Side Profile</Text>
        <View style={styles.stepBadge}>
          <Text style={styles.stepText}>2/2</Text>
        </View>
      </View>

      <View style={styles.optionalBadge}>
        <Text style={styles.optionalText}>📌 Recommended for better accuracy</Text>
      </View>

      <View style={styles.cameraContainer}>
        <CameraView
          ref={cameraRef}
          style={styles.camera}
          facing={facing}
        >
          <View style={styles.overlay}>
            <View style={styles.profileGuide}>
              {/* Profile silhouette guide */}
              <View style={styles.profileOutline} />
            </View>
            <Text style={styles.guideText}>Turn 90° to show your profile</Text>
          </View>
        </CameraView>
      </View>

      <View style={styles.tipsContainer}>
        <Text style={styles.tipsTitle}>Tips for side photo:</Text>
        {PHOTO_TIPS.side.slice(0, 3).map((tip, index) => (
          <Text key={index} style={styles.tip}>• {tip}</Text>
        ))}
      </View>

      <View style={styles.controls}>
        <TouchableOpacity onPress={handlePickImage} style={styles.galleryButton}>
          <Text style={styles.galleryIcon}>🖼️</Text>
          <Text style={styles.galleryText}>Gallery</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleCapture} style={styles.captureButton}>
          <View style={styles.captureInner} />
        </TouchableOpacity>

        <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
          <Text style={styles.skipIcon}>⏭️</Text>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    fontSize: 24,
    color: colors.text,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  stepBadge: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  stepText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  placeholder: {
    width: 40,
  },
  optionalBadge: {
    backgroundColor: `${colors.accent}20`,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    marginHorizontal: spacing.md,
    borderRadius: borderRadius.sm,
    alignSelf: 'center',
    marginBottom: spacing.sm,
  },
  optionalText: {
    fontSize: 13,
    color: colors.accent,
    fontWeight: '500',
  },
  cameraContainer: {
    flex: 1,
    marginHorizontal: spacing.md,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileGuide: {
    width: 200,
    height: 280,
    borderWidth: 2,
    borderColor: 'rgba(6, 182, 212, 0.6)',
    borderStyle: 'dashed',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileOutline: {
    width: 100,
    height: 200,
    borderLeftWidth: 2,
    borderColor: 'rgba(6, 182, 212, 0.4)',
    borderTopLeftRadius: 50,
    borderBottomLeftRadius: 30,
  },
  guideText: {
    position: 'absolute',
    bottom: 60,
    fontSize: 14,
    color: colors.text,
    textAlign: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  tipsContainer: {
    padding: spacing.md,
    backgroundColor: colors.surface,
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    borderRadius: borderRadius.md,
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  tip: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 4,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
    gap: spacing.xl,
  },
  galleryButton: {
    alignItems: 'center',
    gap: 4,
  },
  galleryIcon: {
    fontSize: 24,
  },
  galleryText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  captureButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
  },
  captureInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.text,
    borderWidth: 3,
    borderColor: colors.background,
  },
  skipButton: {
    alignItems: 'center',
    gap: 4,
  },
  skipIcon: {
    fontSize: 24,
  },
  skipText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  permissionContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    gap: spacing.md,
  },
  permissionIcon: {
    fontSize: 64,
  },
  permissionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
  },
  permissionText: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing.md,
  },
  altOption: {
    marginTop: spacing.md,
  },
  altOptionText: {
    fontSize: 15,
    color: colors.primary,
  },
  skipOption: {
    marginTop: spacing.sm,
  },
  skipOptionText: {
    fontSize: 15,
    color: colors.textMuted,
  },
  previewContainer: {
    flex: 1,
    marginHorizontal: spacing.md,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  previewImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  previewTips: {
    padding: spacing.md,
    backgroundColor: colors.surface,
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    borderRadius: borderRadius.md,
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  tipItem: {
    fontSize: 13,
    color: colors.success,
    marginTop: 4,
  },
  previewActions: {
    flexDirection: 'column',
    gap: spacing.sm,
    padding: spacing.lg,
  },
});
