// Using react-icons for easy access to a wide range of icons
// Install with: npm install react-icons
import {
    FiHome,
    FiBarChart2,
    FiTarget,
    FiUser,
    FiSun,
    FiMoon,
    FiLogOut,
    FiPlus,
    FiChevronRight,
    FiAlertCircle,
    FiTrendingUp,
    FiTrendingDown,
    // FiPiggyBank was removed from here
    FiCreditCard,
    FiFileText,
    FiSettings,
    FiHelpCircle,
    FiChevronsRight,
    FiX,
} from "react-icons/fi";

// Icons from the UI
import {
    BsBank, // General Savings
    BsHouseDoor, // House
    BsFillHeartFill, // Wedding
    BsBook, // Study Loan
    BsFillGridFill,
    BsPieChartFill,
    BsPersonFill,
    BsPiggyBank, // <-- Added BsPiggyBank here
} from "react-icons/bs";

import { MdOutlineFastfood, MdOutlineShoppingBag, MdHomeWork } from "react-icons/md";

export const ICONS = {
    Home: FiHome,
    Statistics: FiBarChart2,
    Goals: FiTarget,
    Profile: FiUser,
    Sun: FiSun,
    Moon: FiMoon,
    Logout: FiLogOut,
    Add: FiPlus,
    RightArrow: FiChevronRight,
    Warning: FiAlertCircle,
    Income: FiTrendingUp,
    Expense: FiTrendingDown,
    Savings: BsPiggyBank, // <-- Changed to BsPiggyBank
    Loan: FiCreditCard,
    Docs: FiFileText,
    Settings: FiSettings,
    Help: FiHelpCircle,
    Expand: FiChevronsRight,
    Close: FiX,

    // Categories
    House: BsHouseDoor,
    Wedding: BsFillHeartFill,
    GeneralSavings: BsBank,
    StudyLoan: BsBook,
    Food: MdOutlineFastfood,
    Beauty: MdOutlineShoppingBag,
    Rent: MdHomeWork,
};
