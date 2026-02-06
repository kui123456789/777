import { ref, nextTick } from 'vue';
import { gsap } from 'gsap';

/**
 * Composable for clothing toggle animation with GSAP
 * Used by CharacterCard and RobotCard to avoid code duplication
 */
export function useClothingToggle() {
  const showClothing = ref(false);
  const clothingListRef = ref<HTMLElement | null>(null);

  const toggleClothing = () => {
    showClothing.value = !showClothing.value;
    nextTick(() => {
      if (clothingListRef.value) {
        if (showClothing.value) {
          gsap.fromTo(
            clothingListRef.value,
            { height: 0, opacity: 0 },
            { height: 'auto', opacity: 1, duration: 0.3, ease: 'power2.out' },
          );
        } else {
          gsap.to(clothingListRef.value, {
            height: 0,
            opacity: 0,
            duration: 0.2,
            ease: 'power2.in',
          });
        }
      }
    });
  };

  return {
    showClothing,
    clothingListRef,
    toggleClothing,
  };
}
