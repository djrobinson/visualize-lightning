import { shallowMount } from '@vue/test-utils';
import LightningNetwork from '@/components/LightningNetwork.vue';

describe('LightningNetwork.vue', () => {
  it('renders props.msg when passed', () => {
    const msg = 'new message';
    const wrapper = shallowMount(LightningNetwork, {
      propsData: { msg },
    });
    expect(wrapper.text()).toMatch(msg);
  });
});
