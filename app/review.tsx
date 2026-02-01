import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { colors, spacing, borderRadius } from '@/constants/theme';
import { Button, GenderSwitch } from '@/components';
import { useAppStore } from '@/store/useAppStore';

export default function ReviewPhotos() {
  const router = useRouter();
  const { frontPhotoUri, sidePhotoUri, gender, setGender, clearPhotos } = useAppStore();

  // Redirect if no front photo
  React.useEffect(() => {
    if (!frontPhotoUri) {
      router.replace('/capture-front');
    }
  }, [frontPhotoUri, router]);

  const handleRetakeFront = () => {
    router.push('/capture-front');
  };

  const handleRetakeSide = () => {
    router.push('/capture-side');
  };

  const handleAnalyze = () => {
    router.push('/analyzing');
  };

  const handleCancel = () => {
    clearPhotos();
    router.replace('/');
  };

  if (!frontPhotoUri) return null;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleCancel} style={styles.cancelButton}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Review Photos</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.photosContainer}>
          {/* Front Photo */}
          <View style={styles.photoCard}>
            <View style={styles.photoLabelContainer}>
              <Text style={styles.photoLabel}>Front Photo</Text>
              <View style={styles.requiredBadge}>
                <Text style={styles.requiredText}>Required</Text>
              </View>
            </View>
            <View style={styles.photoWrapper}>
              <Image source={{ uri: frontPhotoUri }} style={styles.photo} />
              <TouchableOpacity
                style={styles.retakeOverlay}
                onPress={handleRetakeFront}
              >
                <Text style={styles.retakeIcon}>🔄</Text>
                <Text style={styles.retakeText}>Retake</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Side Photo */}
          <View style={styles.photoCard}>
            <View style={styles.photoLabelContainer}>
              <Text style={styles.photoLabel}>Side Profile</Text>
              <View style={[styles.requiredBadge, styles.optionalBadge]}>
                <Text style={styles.optionalText}>Optional</Text>
              </View>
            </View>
            {sidePhotoUri ? (
              <View style={styles.photoWrapper}>
                <Image source={{ uri: sidePhotoUri }} style={styles.photo} />
                <TouchableOpacity
                  style={styles.retakeOverlay}
                  onPress={handleRetakeSide}
                >
                  <Text style={styles.retakeIcon}>🔄</Text>
                  <Text style={styles.retakeText}>Retake</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.addPhotoPlaceholder}
                onPress={handleRetakeSide}
              >
                <Text style={styles.addPhotoIcon}>➕</Text>
                <Text style={styles.addPhotoText}>Add side photo</Text>
                <Text style={styles.addPhotoHint}>Improves accuracy</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Gender Selection */}
        <View style={styles.genderSection}>
          <Text style={styles.sectionTitle}>Analysis Type</Text>
          <GenderSwitch value={gender} onChange={setGender} />
        </View>

        {/* What to expect */}
        <View style={styles.expectSection}>
          <Text style={styles.sectionTitle}>What You'll Receive</Text>
          <View style={styles.expectList}>
            <View style={styles.expectItem}>
              <Text style={styles.expectIcon}>⭐</Text>
              <Text style={styles.expectText}>Overall rating out of 10</Text>
            </View>
            <View style={styles.expectItem}>
              <Text style={styles.expectIcon}>👁️</Text>
              <Text style={styles.expectText}>Individual feature ratings</Text>
            </View>
            <View style={styles.expectItem}>
              <Text style={styles.expectIcon}>💡</Text>
              <Text style={styles.expectText}>Personalized improvement tips</Text>
            </View>
            <View style={styles.expectItem}>
              <Text style={styles.expectIcon}>📊</Text>
              <Text style={styles.expectText}>Facial harmony analysis</Text>
            </View>
          </View>
        </View>

        {/* Disclaimer */}
        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerIcon}>🔒</Text>
          <Text style={styles.disclaimerText}>
            Your photos are analyzed securely and are not stored after processing. Results are estimates based on general guidelines.
          </Text>
        </View>
      </ScrollView>

      {/* Bottom CTA */}
      <View style={styles.bottomCta}>
        <Button
          title="Analyze My Face"
          onPress={handleAnalyze}
          size="large"
          fullWidth
        />
        <Text style={styles.ctaHint}>
          Analysis takes about 10-15 seconds
        </Text>
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
  cancelButton: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  cancelText: {
    fontSize: 16,
    color: colors.textMuted,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  placeholder: {
    width: 60,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: 140,
  },
  photosContainer: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  photoCard: {
    flex: 1,
  },
  photoLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  photoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  requiredBadge: {
    backgroundColor: `${colors.primary}20`,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  requiredText: {
    fontSize: 10,
    color: colors.primary,
    fontWeight: '600',
  },
  optionalBadge: {
    backgroundColor: colors.surfaceLight,
  },
  optionalText: {
    fontSize: 10,
    color: colors.textMuted,
    fontWeight: '500',
  },
  photoWrapper: {
    aspectRatio: 3 / 4,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    position: 'relative',
  },
  photo: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  retakeOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.sm,
  },
  retakeIcon: {
    fontSize: 14,
  },
  retakeText: {
    fontSize: 13,
    color: colors.text,
    fontWeight: '500',
  },
  addPhotoPlaceholder: {
    aspectRatio: 3 / 4,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  addPhotoIcon: {
    fontSize: 32,
  },
  addPhotoText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  addPhotoHint: {
    fontSize: 12,
    color: colors.textMuted,
  },
  genderSection: {
    marginBottom: spacing.xl,
    alignItems: 'center',
    gap: spacing.md,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  expectSection: {
    marginBottom: spacing.lg,
  },
  expectList: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    gap: spacing.sm,
    marginTop: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  expectItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  expectIcon: {
    fontSize: 18,
    width: 28,
    textAlign: 'center',
  },
  expectText: {
    fontSize: 14,
    color: colors.textSecondary,
    flex: 1,
  },
  disclaimer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    padding: spacing.md,
    backgroundColor: colors.surfaceLight,
    borderRadius: borderRadius.md,
  },
  disclaimerIcon: {
    fontSize: 16,
  },
  disclaimerText: {
    flex: 1,
    fontSize: 12,
    color: colors.textMuted,
    lineHeight: 18,
  },
  bottomCta: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.lg,
    paddingBottom: spacing.xl,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  ctaHint: {
    fontSize: 12,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
});
