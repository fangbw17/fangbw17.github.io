import navLocale from "../pages/nav.json";

interface SidebarItem {
    text: string;
    subDir?: string;
    children: Array<{
        text: string;
        link: string;
    }>;
}

interface Sidebar {
    [path: string]: SidebarItem[];
}

function getSidebars() {
    const sidebar: Sidebar = JSON.parse(JSON.stringify(navLocale.sidebar));
    // Object.keys(sidebar).forEach((key) => {
    //     return sidebar[key].forEach((item) => {
    //         return (
    //             item.children &&
    //             item.children.forEach((subItem) => {
    //                 subItem.link =
    //                     key +
    //                     (item.subDir ? item.subDir + "/" : "") +
    //                     subItem.link;
    //             })
    //         );
    //     });
    // });
    // console.log(JSON.stringify(sidebar));
    return sidebar;
}

export const sidebar = getSidebars();
