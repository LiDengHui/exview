/**
 * @flow
 */
import _ from "lodash";

function strExist(dest: string, str: string): boolean {
    return dest.split(",").indexOf(str) > -1;
}
/**
 * @param items
 * @param types
 */
export default (
    items: Array<Object>,
    types: Array<string> = ["item", "sub", "group"]
): Array<Object> => {
    const result = _.cloneDeep(items);

    for (let i = types.length - 1; i > 0; i -= 1) {
        result.forEach(item => {
            item.type = item.type || "";
            if (strExist(item.type, types[i])) {
                item.children = _.filter(
                    result,
                    n => item.children && item.children.indexOf(n.name) > -1
                );
            }
        });
    }
    return result.filter(
        item => strExist(item.type, "sub") || strExist(item.type, "item")
    );
};
