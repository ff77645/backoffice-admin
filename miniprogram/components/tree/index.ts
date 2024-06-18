Component({
  properties:{
    nodes:Array
  },
  data:()=>({
    show:false
  }),
  methods:{
    onToggle(){
      (this as any).setData({
        show:!(this as any).data.show
      })
    }
  },
  lifetimes:{
    
  }
})