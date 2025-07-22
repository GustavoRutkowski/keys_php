import LocalData from "./utils/LocalData";
import setupHeader from "./utils/setupHeader";

setupHeader(
    LocalData.get('token') as string,
    document.querySelector('ul.header-navigator__links-list') as HTMLElement
);