import Homepage from 'pages/Homepage/Homepage';
import NFTListPage from 'pages/NFTListPage/NFTListPage';
import RedeemListPage from 'pages/RedeemListPage/RedeemListPage';

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
		url: '/nft',
		Component: NFTListPage,
		protected: true,
		// LayoutElement: AppLayout,
	},
	{
		url: '/redeem',
		Component: RedeemListPage,
		protected: true,
	},
];
