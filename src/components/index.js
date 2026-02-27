import Menu from "./Menu/Menu";
import MenuItem from "./Menu/MenuItem";
import MenuGroup from "./Menu/MenuGroup";
import SubMenu from "./Menu/SubMenu";
import Header from "./Header";
import Table from "./Table/Table";

import Toolbar from "./Toolbar/Toolbar";
import Form from "./Form/Form";
import FormItem from "./Form/FormItem";

import widgets from "./widgets/index";

const comps = {
    Menu,
    Table,
    MenuItem,
    MenuGroup,
    SubMenu,
    Header,
    Toolbar,
    Form,
    FormItem
};

Object.keys(widgets).forEach(key => {
    comps[`Widget${key}`] = widgets[key];
});

export default comps;
