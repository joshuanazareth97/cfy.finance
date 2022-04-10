import Homepage from 'pages/Homepage/Homepage';
import LoanListPage from 'pages/LoanListPage/LoanListPage';
import NFTListPage from 'pages/NFTListPage/NFTListPage';

interface IRoute {
	url: string;
	Component: React.FC;
	protected: boolean;
	LayoutElement?: React.FC;
}

export const routeList: IRoute[] = [
	{
		url: '/',
		Component: Homepage,
		protected: false,
	},
	// PROTECTED ROUTE
	{
		url: '/borrow',
		Component: NFTListPage,
		protected: true,
		// LayoutElement: AppLayout,
	},
	{
		url: '/lend',
		Component: LoanListPage,
		protected: true,
	},
];
