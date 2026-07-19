import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { listProducts, setSearch } from '../actions/productActions';
import MessageBox from '../components/MessageBox';
import SkeletonGrid from '../components/SkeletonGrid';
import ProductRail from '../components/ProductRail';
import Product from '../components/Product';
import { CATEGORIES } from '../components/Navbar';
import { imgSrc, onImgError } from '../utils';

const CATEGORY_ICONS = {
  'Mobiles & Tablets': 'fa-mobile',
  Electronics: 'fa-laptop',
  "Men's Fashion": 'fa-male',
  "Women's Fashion": 'fa-female',
  Watches: 'fa-clock-o',
  'Beauty & Care': 'fa-magic',
  'Home & Kitchen': 'fa-home',
  Accessories: 'fa-diamond',
  'Sports & Fitness': 'fa-futbol-o',
};

export default function HomeScreen() {
  const dispatch = useDispatch();
  const { loading, error, products } = useSelector((state) => state.productList);

  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    dispatch(listProducts());
    localStorage.removeItem('search');
    dispatch(setSearch());
  }, [dispatch]);

  // Derived merchandising rails — all computed from the live catalog.
  const rails = useMemo(() => {
    if (!products || products.length === 0) return null;
    const byDiscount = [...products].sort((a, b) => (b.discount || 0) - (a.discount || 0));
    const byRating = [...products].sort((a, b) => b.rating - a.rating);
    const byNewest = [...products].sort(
      (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
    );
    const byReviews = [...products].sort((a, b) => (b.numReviews || 0) - (a.numReviews || 0));
    const featured = products.filter((p) => p.isFeatured);

    const categoryMeta = CATEGORIES.map((cat) => {
      const items = products.filter((p) => p.category === cat);
      return {
        name: cat,
        count: items.length,
        image: items[0] ? items[0].image : null,
      };
    }).filter((c) => c.count > 0);

    const brandCounts = {};
    products.forEach((p) => {
      brandCounts[p.brand] = (brandCounts[p.brand] || 0) + 1;
    });
    const topBrands = Object.entries(brandCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 12);

    return {
      deals: byDiscount.slice(0, 10),
      bestSellers: byRating.slice(0, 10),
      newArrivals: byNewest.slice(0, 10),
      trending: byReviews.slice(0, 10),
      recommended: (featured.length >= 8 ? featured : byRating.slice(10, 30)).slice(0, 8),
      heroTiles: byRating.slice(0, 4),
      categoryMeta,
      topBrands,
    };
  }, [products]);

  const subscribeHandler = (e) => {
    e.preventDefault();
    if (email.trim()) setSubscribed(true);
  };

  return (
    <div className="page">
      {/* ---------- hero ---------- */}
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-copy">
            <span className="hero-kicker">
              <i className="fa fa-bolt"></i> Summer Sale — up to 40% off
            </span>
            <h1>
              Everything you love, <span className="hl">one store.</span>
            </h1>
            <p>
              Shop 140+ curated products across tech, fashion, beauty and home
              — honest prices, fast delivery, easy returns.
            </p>
            <div className="hero-cta">
              <Link to="/sort/sortRatingd" className="btn btn-light btn-lg">
                Shop Best Sellers
              </Link>
              <Link
                to={`/search/category/${encodeURIComponent('Mobiles & Tablets')}`}
                className="btn btn-glass btn-lg"
              >
                Explore Tech <i className="fa fa-long-arrow-right"></i>
              </Link>
            </div>
            <div className="hero-stats">
              <div className="hero-stat">
                <b>140+</b>
                <span>Products</span>
              </div>
              <div className="hero-stat">
                <b>75+</b>
                <span>Brands</span>
              </div>
              <div className="hero-stat">
                <b>4.8★</b>
                <span>Avg. rating</span>
              </div>
              <div className="hero-stat">
                <b>24h</b>
                <span>Dispatch</span>
              </div>
            </div>
          </div>
          {rails && (
            <div className="hero-art">
              {rails.heroTiles.map((p) => (
                <Link key={p._id} to={`/product/${p._id}`} className="tile">
                  <img src={imgSrc(p.image)} onError={onImgError} alt={p.name} />
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ---------- perks ---------- */}
      <section className="perks">
        <div className="perk">
          <i className="fa fa-truck"></i>
          <div>
            <b>Free Shipping</b>
            <span>On all orders over $50</span>
          </div>
        </div>
        <div className="perk">
          <i className="fa fa-refresh"></i>
          <div>
            <b>Easy Returns</b>
            <span>30-day return policy</span>
          </div>
        </div>
        <div className="perk">
          <i className="fa fa-lock"></i>
          <div>
            <b>Secure Payment</b>
            <span>PayPal & major cards</span>
          </div>
        </div>
        <div className="perk">
          <i className="fa fa-comments-o"></i>
          <div>
            <b>24/7 Support</b>
            <span>We're here to help</span>
          </div>
        </div>
      </section>

      {error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : loading || !rails ? (
        <>
          <SkeletonGrid count={8} />
        </>
      ) : (
        <>
          {/* ---------- categories ---------- */}
          <section className="section">
            <div className="section-head">
              <div>
                <span className="kicker">Browse</span>
                <h2>Shop by Category</h2>
              </div>
            </div>
            <div className="catgrid">
              {rails.categoryMeta.map((cat) => (
                <Link
                  key={cat.name}
                  className="catcard"
                  to={`/search/category/${encodeURIComponent(cat.name)}`}
                >
                  <i className={`fa ${CATEGORY_ICONS[cat.name] || 'fa-tag'} cat-ico`}></i>
                  <span className="catcard-img">
                    <img src={imgSrc(cat.image)} onError={onImgError} alt={cat.name} loading="lazy" />
                  </span>
                  <b>{cat.name}</b>
                  <span>{cat.count} products</span>
                </Link>
              ))}
            </div>
          </section>

          {/* ---------- deals ---------- */}
          <ProductRail
            kicker="Limited time"
            title="Deals of the Week"
            products={rails.deals}
            link="/sort/sortPriced"
            linkLabel="All deals"
          />

          {/* ---------- promo banners ---------- */}
          <section className="section promo-duo">
            <div className="promo promo-a">
              <span className="p-kicker">Tech Fest</span>
              <h3>Smartphones from $129</h3>
              <p>Flagships and budget champs — all with 1-year warranty.</p>
              <Link
                to={`/search/category/${encodeURIComponent('Mobiles & Tablets')}`}
                className="btn btn-light"
              >
                Shop Phones
              </Link>
            </div>
            <div className="promo promo-b">
              <span className="p-kicker">Glow Up</span>
              <h3>Beauty under $20</h3>
              <p>Skincare, fragrance and makeup essentials.</p>
              <Link
                to={`/search/category/${encodeURIComponent('Beauty & Care')}`}
                className="btn btn-light"
              >
                Shop Beauty
              </Link>
            </div>
          </section>

          {/* ---------- best sellers ---------- */}
          <ProductRail
            kicker="Loved by shoppers"
            title="Best Sellers"
            products={rails.bestSellers}
            link="/sort/sortRatingd"
          />

          {/* ---------- new arrivals ---------- */}
          <ProductRail
            kicker="Just landed"
            title="New Arrivals"
            products={rails.newArrivals}
            link="/sort/sortNamea"
          />

          {/* ---------- wide promo ---------- */}
          <section className="section">
            <div className="promo promo-wide">
              <span className="p-kicker">Members get more</span>
              <h3>Extra 10% off with code SUMMER26</h3>
              <p>Applied at checkout on your first order.</p>
              <Link to="/register" className="btn btn-light">
                Create free account
              </Link>
            </div>
          </section>

          {/* ---------- trending ---------- */}
          <ProductRail
            kicker="Most reviewed"
            title="Trending Now"
            products={rails.trending}
            link="/sort/sortRatingd"
          />

          {/* ---------- recommended ---------- */}
          <section className="section">
            <div className="section-head">
              <div>
                <span className="kicker">Picked for you</span>
                <h2>Recommended</h2>
              </div>
            </div>
            <div className="pgrid">
              {rails.recommended.map((product) => (
                <Product key={product._id} product={product} />
              ))}
            </div>
          </section>

          {/* ---------- brands ---------- */}
          <section className="section">
            <div className="section-head">
              <div>
                <span className="kicker">Official partners</span>
                <h2>Featured Brands</h2>
              </div>
            </div>
            <div className="brandgrid">
              {rails.topBrands.map(([brand, count]) => (
                <Link
                  key={brand}
                  className="brandchip"
                  to={`/search/brand/${encodeURIComponent(brand)}`}
                >
                  {brand}
                  <small>{count} products</small>
                </Link>
              ))}
            </div>
          </section>
        </>
      )}

      {/* ---------- newsletter ---------- */}
      <section className="section newsletter">
        <div>
          <h2>Stay in the loop</h2>
          <p>New drops, exclusive deals and style tips — straight to your inbox.</p>
        </div>
        {subscribed ? (
          <div className="alert alert-success" style={{ margin: 0 }}>
            <i className="fa fa-check-circle"></i> Thanks! You're on the list.
          </div>
        ) : (
          <form className="newsletter-form" onSubmit={subscribeHandler}>
            <input
              type="email"
              required
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button className="btn btn-primary" type="submit">
              Subscribe
            </button>
          </form>
        )}
      </section>
    </div>
  );
}
