import { render } from '@testing-library/vue';
import ProfileView from '../views/ProfileView.vue';
import { setActivePinia, createPinia } from 'pinia';
import { it, describe, expect } from 'vitest';

describe.concurrent('ProfileView', () => {
  it('should render', async () => {
    const pinia = createPinia();
    setActivePinia(pinia);
    const { baseElement } = render(ProfileView);

    expect(baseElement).toBeTruthy();
  });
});
