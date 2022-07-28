import { useCompute } from "../../use/use-compute";
import { computed } from "vue";
/**
 * 单元格显示组件
 */
export default {
  name: "FsCell",
  props: {
    item: {},
    /**
     * 获取scope参数方法
     */
    getScope: {
      type: Function
    },
    slots: {}
  },
  setup(props) {
    const { doComputed } = useCompute();
    const computedPropsComponent = computed(() => {
      return props.item.component;
    });
    const computedComponent = doComputed(computedPropsComponent, props.getScope);
    return (props, ctx) => {
      if (props.slots) {
        return <span class={"fs-cell"}>{props.slots(props.getScope())}</span>;
      } else if (props.item.formatter) {
        return <span class={"fs-cell"}>{props.item.formatter(props.getScope())}</span>;
      } else if (props.item.cellRender) {
        return <span class={"fs-cell"}>{props.item.cellRender(props.getScope())}</span>;
      } else if (props.item.render) {
        console.warn("column.render 配置已废弃，请使用column.cellRender代替");
        return <span class={"fs-cell"}>{props.item.render(props.getScope())}</span>;
      } else if (computedComponent.value?.name) {
        if (computedComponent.value?.show === false) {
          return;
        }
        console.log("computedComponent:", JSON.stringify(computedComponent.value));
        return <fs-component-render ref={"targetRef"} {...computedComponent.value} scope={props.getScope()} />;
      } else {
        return <span class={"fs-cell"}> {props.getScope().value}</span>;
      }
    };
  },
  methods: {
    getTargetRef() {
      return this.$refs.targetRef?.getTargetRef();
    }
  }
};
