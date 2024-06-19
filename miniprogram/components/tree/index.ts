Component({
  properties:{
    nodes:Array
  },
  data:()=>({
    show:false,
    treeData:[
      {
        title:'1',
        children:[
          {
            title:'1-1',
            children:[
              {
                title:'1-1-1'
              },
              {
                title:'1-1-2'
              },
            ]
          },
          {
            title:'1-2'
          },
        ]
      },
      {
        title:'2',
        children:[
          {
            title:'2-1'
          },
          {
            title:'2-2'
          },
        ]
      }
    ]
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