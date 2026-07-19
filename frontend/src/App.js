import React from 'react';
import { useSelector } from 'react-redux';
import { BrowserRouter, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PrivateUserRoute from './components/PrivateRoute';
import PrivateCustomerRoute from './components/PrivateCustomerRoute';
import PrivateAdminRoute from './components/PrivateAdminRoute';

import HomeScreen from './screens/HomeScreen';
import ProductScreen from './screens/ProductScreen';
import CartScreen from './screens/CartScreen';
import WishListScreen from './screens/WishListScreen';
import SearchScreen from './screens/SearchScreen';
import FilterScreen from './screens/FilterScreen';
import SortScreen from './screens/SortScreen';
import SearchPriceScreen from './screens/SearchPriceScreen';
import SigninScreen from './screens/SigninScreen';
import RegisterScreen from './screens/RegisterScreen';
import ProfileScreen from './screens/ProfileScreen';
import ShippingAddressScreen from './screens/ShippingAddressScreen';
import PaymentMethodScreen from './screens/PaymentMethodScreen';
import PlaceOrderScreen from './screens/PlaceOrderScreen';
import OrderScreen from './screens/OrderScreen';
import OrderHistoryScreen from './screens/OrderHistoryScreen';

import AdminDashboard from './screens/AdminDashboard';
import AdminProductScreen from './screens/AdminProductScreen';
import AdminProductList from './screens/AdminProductList';
import AdminAddProductScreen from './screens/AdminAddProductScreen';
import AdminUpdateProduct from './components/AdminUpdateProduct';
import RequestAdmin from './screens/RequestAdmin';
import UserSummary from './screens/UserSummary';
import OrderSummary from './screens/OrderSummary';

import CustomerProfile from './screens/CustomerProfile';
import CustomerProductList from './screens/CustomerProductList';
import CustomerAddRequest from './screens/CustomerAddRequest';
import CustomerRequestStatus from './screens/CustomerRequestStatus';
import CustomerUpdateProduct from './components/CustomerUpdateProduct';

function App() {
  const { adminInfo } = useSelector((state) => state.userSignin);
  const { customerInfo } = useSelector((state) => state.customerSignin);

  return (
    <BrowserRouter>
      <div className="grid-container">
        <Navbar />
        <main>
          <Route path="/cart/:id?" component={CartScreen}></Route>
          <Route path="/wishlist" component={WishListScreen}></Route>
          <Route path="/product/:id" component={ProductScreen}></Route>
          <PrivateUserRoute path="/shipping" component={ShippingAddressScreen}></PrivateUserRoute>
          <PrivateUserRoute path="/payment" component={PaymentMethodScreen}></PrivateUserRoute>
          <PrivateUserRoute path="/placeorder" component={PlaceOrderScreen}></PrivateUserRoute>
          <PrivateUserRoute path="/order/:id" component={OrderScreen}></PrivateUserRoute>
          <PrivateUserRoute path="/orderhistory" component={OrderHistoryScreen}></PrivateUserRoute>
          <Route path="/search/:option/:search" component={SearchScreen}></Route>
          <Route path="/filter/:option/" component={FilterScreen}></Route>
          <Route path="/searchByPrice/:option/:min/:max" component={SearchPriceScreen}></Route>
          <Route path="/sort/:sortValue" component={SortScreen}></Route>

          <PrivateUserRoute path="/profile" component={ProfileScreen}></PrivateUserRoute>

          <Route path="/signin" component={SigninScreen}></Route>
          <Route path="/register" component={RegisterScreen}></Route>

          {adminInfo ? (
            <PrivateAdminRoute path="/adminproductlist" component={AdminProductList} exact></PrivateAdminRoute>
          ) : customerInfo ? (
            <PrivateCustomerRoute path="/customerproductlist" component={CustomerProductList} exact></PrivateCustomerRoute>
          ) : (
            <Route path="/" component={HomeScreen} exact></Route>
          )}

          <PrivateAdminRoute path="/requestadmin" component={RequestAdmin} exact></PrivateAdminRoute>
          <PrivateAdminRoute path="/admindashboard" component={AdminDashboard} exact></PrivateAdminRoute>
          <PrivateAdminRoute path="/adminupdateproduct/:id" component={AdminUpdateProduct}></PrivateAdminRoute>
          <PrivateAdminRoute path="/adminaddproduct" component={AdminAddProductScreen}></PrivateAdminRoute>
          <PrivateAdminRoute path="/summary/:option" component={UserSummary}></PrivateAdminRoute>
          <PrivateAdminRoute path="/ordersummary" component={OrderSummary}></PrivateAdminRoute>
          <Route path="/adminproduct/:id" component={AdminProductScreen}></Route>

          <PrivateCustomerRoute path="/customerprofile" component={CustomerProfile}></PrivateCustomerRoute>
          <PrivateCustomerRoute path="/cutomerupdateproduct/:id" component={CustomerUpdateProduct}></PrivateCustomerRoute>
          <PrivateCustomerRoute path="/customeraddrequestproduct" component={CustomerAddRequest}></PrivateCustomerRoute>
          <PrivateCustomerRoute path="/customerrequeststatus" component={CustomerRequestStatus}></PrivateCustomerRoute>
          <PrivateCustomerRoute path="/customerproduct/:id" component={AdminProductScreen}></PrivateCustomerRoute>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
