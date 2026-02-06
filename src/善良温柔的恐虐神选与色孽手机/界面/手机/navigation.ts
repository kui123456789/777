import { useRouter } from 'vue-router';

export type PhoneView =
  | '主界面'
  | '状态栏'
  | '透视'
  | '背包'
  | '催眠'
  | '远程操控'
  | '肉体软化'
  | '商店'
  | '世界信息'
  | '设置';

// Navigation helper composable
export function usePhoneNavigation() {
  const router = useRouter();

  const navigateTo = (view: PhoneView) => {
    const path = view === '主界面' ? '/' : `/${view}`;
    router.push(path);
  };

  const goBack = () => router.back();
  const goHome = () => router.push('/');

  return { navigateTo, goBack, goHome };
}
