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
    expanded:{
      type: Boolean,
      value: false,
    },
  },
  data:{
    // expanded: false,
    inited:false
  },
  observers:{
    expanded(val){
      if(!this.data.inited){
        val ? this.init() : ''
        return
      }
      setContentAnimate(this,val,true)
    }
  },
  methods:{
    init(){
      this.setData({
        inited:true
      },()=>{
        setContentAnimate(this,this.data.expanded,true)
      })
    }
  },
  lifetimes:{
   
  }
})