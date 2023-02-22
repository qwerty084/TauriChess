import { render } from '@testing-library/vue';
import StudyView from '../views/StudyView.vue';
import { setActivePinia, createPinia } from 'pinia';
import { it, describe, expect } from 'vitest';

describe.concurrent('ProfileView', () => {
  it('should render', async () => {
    const pinia = createPinia();
    setActivePinia(pinia);
    const { baseElement } = render(StudyView);

    expect(baseElement).toBeTruthy();
  });
});
