import AssessmentIcon from '@mui/icons-material/Assessment';
import CategoryIcon from '@mui/icons-material/Category';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import DiscountIcon from '@mui/icons-material/Discount';
import InventoryIcon from '@mui/icons-material/Inventory';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import FeaturedVideoIcon from '@mui/icons-material/FeaturedVideo';
import ViewCarouselIcon from '@mui/icons-material/ViewCarousel';
import ViewAgendaIcon from '@mui/icons-material/ViewAgenda';
import BreakfastDiningIcon from '@mui/icons-material/BreakfastDining';

const SideBarList =[
    {
      "name":"Overview",
      "path":"/",
      "icon": <AssessmentIcon className="text-white icon"/>
    },
    {
      "name":"Categorys",
      "path":"/category",
      "icon": <CategoryIcon className="text-white icon" />,
      // "moreOptions": true,
      // "others":[
      //   {
      //     "name":"Parent Category",
      //     "path":"/category",
      //     "icon": <CategoryIcon className="text-white icon" />,
      //   },
      //   {
      //     "name":"Child Category",
      //     "path":"/category/child",
      //     "icon": <CategoryIcon className="text-white icon" />,
      //   }
      // ]
    },
    {
      "name":"Advertisment",
      "path":"",
      "icon": <FeaturedVideoIcon className="text-white icon" />,
      "moreOptions": true,
      "others":[
        {
          "name":"Slider",
          "path":"/slider",
          "icon": <ViewCarouselIcon className="text-white icon" />,
        },
        {
          "name":"Addvertisment Card",
          "path":"/advertisment/banner",
          "icon": <ViewAgendaIcon className="text-white icon" />,
        }
      ]
    },
    {
      "name":"Products",
      "path":"/product",
      "icon": <BreakfastDiningIcon className="text-white icon" />
    },
    {
      "name":"Orders",
      "path":"/",
      "icon": <ShoppingCartIcon className="text-white icon" />
    },
    {
      "name":"Customers",
      "path":"/",
      "icon": <ManageAccountsIcon className="text-white icon" />
    },
  
  
    {
      "name":"Discounts",
      "path":"/",
      "icon": <DiscountIcon className="text-white icon" />
    },
    {
      "name":"Inventory",
      "path":"/",
      "icon": <InventoryIcon className="text-white icon"/>
    },
    {
      "name":"Sales Reports",
      "path":"/",
      "icon": <CurrencyRupeeIcon className="text-white icon"/>
    },
    {
      "name":"Shipping",
      "path":"/",
      "icon": <LocalShippingIcon className="text-white icon"/>
    },
    {
      "name":"User",
      "path":"/",
      "icon": <PersonIcon className="text-white icon"/>
    },
    {
      "name":"Theming",
      "path":"/theming",
      "icon": <PersonIcon className="text-white icon"/>
    },
    {
      "name":"Logout",
      "path":"/",
      "icon": <LogoutIcon className="text-white icon"/>
    }
  ]

  export default SideBarList