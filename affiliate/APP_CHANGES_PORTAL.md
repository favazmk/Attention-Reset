# App.jsx — changes to add InfluencerPortal routing

## CHANGE 1 — Add import at the top (with the other imports)

import InfluencerPortal from './pages/InfluencerPortal';


## CHANGE 2 — Add hash-based routing state

Add this new state variable with the others near the top of the App() function:

  const [affiliateCode, setAffiliateCode] = useState(null);


## CHANGE 3 — Add URL hash detection useEffect

Add this useEffect BEFORE the existing useEffects in App():

  useEffect(() => {
    const checkHash = () => {
      const hash = window.location.hash;

      // Route: #affiliate/RAVI10  →  influencer portal
      if (hash.startsWith('#affiliate/')) {
        const code = hash.replace('#affiliate/', '').split('?')[0].trim().toUpperCase();
        setAffiliateCode(code || null);
        return;
      }

      // Route: #admin  →  admin panel (already handled by existing logic)
      setAffiliateCode(null);
    };

    checkHash();
    window.addEventListener('hashchange', checkHash);
    return () => window.removeEventListener('hashchange', checkHash);
  }, []);


## CHANGE 4 — Add InfluencerPortal render gate

Add this block right BEFORE the existing `if (showAuth)` block in the JSX return section:

  if (affiliateCode) {
    return (
      <InfluencerPortal
        couponCode={affiliateCode}
        onBack={() => {
          window.location.hash = '';
          setAffiliateCode(null);
        }}
      />
    );
  }


---

## How influencers access their portal

Send each influencer their unique URL:

  https://your-app.vercel.app/#affiliate/RAVI10
  https://your-app.vercel.app/#affiliate/AKSHAY20

That's it. No login. No password. They open the link and see ONLY their own stats.

## What they see

- Total sales they've driven (number of purchases)
- Total revenue generated via their code
- Total commission earned (all time)
- Pending payout amount (not yet paid)
- Paid out amount (already transferred)
- Full transaction history with dates, sale amounts, commission per sale, and payout status

## Security note

The coupon code in the URL IS the access key. Whoever has the link can see the stats.
This is fine for most influencer setups — they're not sensitive data, just their own
commission numbers. If you want stricter access later, add a simple PIN per influencer.
