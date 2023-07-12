import {createVNode} from "vue"
import * as Icons from "@ant-design/icons-vue"
const icons = Icons;
const Icon = (props) => {
    const {icon} = props;
    return createVNode(icons[icon])
}
export default Icon;