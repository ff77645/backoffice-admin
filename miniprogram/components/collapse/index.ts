import {setContentAnimate} from '@vant/weapp/collapse-item/animate'


Component({
  properties:{
    size: String,
    name: null,
    title: null,
    value: null,
    icon: String,
    label: String,
    disabled: Boolean,
    clickable: Boolean,
    border: {
      type: Boolean,
      value: true,
    },
    isLink: {
      type: Boolean,
      value: true,
    },
    defaultExpanded:{
      type: Boolean,
      value: false,
    },
  },
  data:{
    expanded: false,
  },
  methods:{
    updateExpanded() {
      if (this.data.expanded) {
        setContentAnimate(this, this.data.expanded, true);
      }
    },

    onClick() {
      if (this.data.disabled) {
        return;
      }
      const { expanded } = this.data;
      const val = !expanded
      this.setData({expanded:val})
      setContentAnimate(this, val, true);
    },
  },
  lifetimes:{
    attached(){
      // this.updateExpanded();
      this.data.defaultExpanded && this.onClick()
    }
  }
})