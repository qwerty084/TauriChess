import { render } from '@testing-library/vue';
import BoardView from '../views/BoardView.vue';
import { setActivePinia, createPinia } from 'pinia';
import { it, describe, expect } from 'vitest';

describe.concurrent('BoardView', () => {
  it('should render', async () => {
    const pinia = createPinia();
    setActivePinia(pinia);
    const { baseElement } = render(BoardView);

    expect(baseElement).toBeTruthy();
  });
});
