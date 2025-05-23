import React from "react";

const overview = React.lazy(() => import('../app/OverView/Index.tsx'))
const category = React.lazy(() => import('../app/Category/Index'))
const childCategory = React.lazy(() => import('../app/Category/ChildCategory.tsx'))
const CardAdvertisment = React.lazy(() => import('../app/Advertisment/CardImage.tsx'))
const Slider = React.lazy(() => import('../app/Slider/SliderAdmin.tsx'))
const ProductCom = React.lazy(() => import('../app/Product/ProductCom.tsx'))
const ThemingCom = React.lazy(() => import('../app/Theming/Index.tsx'))
const OrderCom = React.lazy(() => import('../app/Orders/index.tsx'))
const CustomerCom = React.lazy(() => import('../app/Customers/Index.tsx'))

const RouteList = [
    { path: "/", component: overview },
    { path: "/category", component: category },
    { path: "/category/child", component: childCategory },
    { path: "/advertisment/banner", component: CardAdvertisment },
    { path: "/slider", component: Slider },
    { path: "/theming", component: ThemingCom },
    { path: "/orders", component: OrderCom },
    { path: "/product", component: ProductCom },
    { path: "/customers", component: CustomerCom }

]


export default RouteList;