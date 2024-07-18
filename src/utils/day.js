import dayjs from "dayjs";
/*语言*/
import "dayjs/locale/zh-cn";
/*插件*/
import relativeTime from "dayjs/plugin/relativeTime";
/*使用*/
dayjs.extend(relativeTime);
dayjs.locale("zh-cn");
export default dayjs;
