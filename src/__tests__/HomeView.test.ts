import { render } from '@testing-library/vue';
import HomeView from '../views/BoardView.vue';
import { setActivePinia, createPinia } from 'pinia';
import { it, describe, expect } from 'vitest';

describe.concurrent('HomeView', () => {
  it('should render', async () => {
    const pinia = createPinia();
    setActivePinia(pinia);
    const { baseElement } = render(HomeView);

    expect(baseElement).toBeTruthy();
  });
});
