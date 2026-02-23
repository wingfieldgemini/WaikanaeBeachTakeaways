(function() {
  'use strict';

  // ── Styles ──────────────────────────────────────────────
  const CSS = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

    #wbt-chat-btn {
      position: fixed; bottom: 24px; right: 24px; z-index: 99999;
      width: 64px; height: 64px; border-radius: 50%; border: none; cursor: pointer;
      background: linear-gradient(135deg, #d4a853 0%, #b8922e 100%);
      box-shadow: 0 6px 24px rgba(212,168,83,.45), 0 2px 8px rgba(0,0,0,.2);
      display: flex; align-items: center; justify-content: center;
      transition: transform .25s cubic-bezier(.4,0,.2,1), box-shadow .25s;
      animation: wbt-pulse 2.5s infinite;
    }
    #wbt-chat-btn:hover { transform: scale(1.1); box-shadow: 0 8px 32px rgba(212,168,83,.55); }
    #wbt-chat-btn svg { width: 32px; height: 32px; fill: #0a1628; }
    @keyframes wbt-pulse {
      0%,100%{box-shadow:0 6px 24px rgba(212,168,83,.45)}
      50%{box-shadow:0 6px 32px rgba(212,168,83,.7)}
    }

    #wbt-chat-btn .wbt-badge {
      position: absolute; top: -2px; right: -2px;
      width: 20px; height: 20px; border-radius: 50%;
      background: #e74c3c; color: #fff; font-size: 11px; font-weight: 700;
      display: flex; align-items: center; justify-content: center;
      animation: wbt-bounce .6s;
    }
    @keyframes wbt-bounce {
      0%{transform:scale(0)}50%{transform:scale(1.3)}100%{transform:scale(1)}
    }

    #wbt-chat-window {
      position: fixed; bottom: 100px; right: 24px; z-index: 100000;
      width: 400px; max-width: calc(100vw - 32px); height: 560px; max-height: calc(100vh - 130px);
      border-radius: 20px; overflow: hidden;
      background: #0d1b2a;
      box-shadow: 0 20px 60px rgba(0,0,0,.5), 0 0 0 1px rgba(212,168,83,.15);
      display: flex; flex-direction: column;
      font-family: 'Inter', -apple-system, sans-serif;
      transform: scale(0) translateY(20px); opacity: 0;
      transform-origin: bottom right;
      transition: transform .35s cubic-bezier(.34,1.56,.64,1), opacity .25s;
      pointer-events: none;
    }
    #wbt-chat-window.wbt-open {
      transform: scale(1) translateY(0); opacity: 1; pointer-events: all;
    }

    .wbt-header {
      background: linear-gradient(135deg, #0a1628 0%, #132238 100%);
      padding: 18px 20px; display: flex; align-items: center; gap: 12px;
      border-bottom: 1px solid rgba(212,168,83,.2);
    }
    .wbt-header-avatar {
      width: 44px; height: 44px; border-radius: 50%;
      background: linear-gradient(135deg, #d4a853, #b8922e);
      display: flex; align-items: center; justify-content: center;
      font-size: 22px; flex-shrink: 0;
    }
    .wbt-header-info { flex: 1; }
    .wbt-header-info h3 { margin: 0; color: #fff; font-size: 15px; font-weight: 600; }
    .wbt-header-info p { margin: 2px 0 0; color: #6fcf97; font-size: 12px; }
    .wbt-close-btn {
      background: rgba(255,255,255,.08); border: none; cursor: pointer;
      width: 34px; height: 34px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      transition: background .2s;
    }
    .wbt-close-btn:hover { background: rgba(255,255,255,.15); }
    .wbt-close-btn svg { width: 16px; height: 16px; fill: #8899aa; }

    .wbt-messages {
      flex: 1; overflow-y: auto; padding: 16px; display: flex; flex-direction: column; gap: 8px;
      scrollbar-width: thin; scrollbar-color: rgba(212,168,83,.3) transparent;
    }
    .wbt-messages::-webkit-scrollbar { width: 5px; }
    .wbt-messages::-webkit-scrollbar-thumb { background: rgba(212,168,83,.3); border-radius: 10px; }

    .wbt-msg { max-width: 85%; animation: wbt-msgIn .3s ease-out; }
    @keyframes wbt-msgIn {
      from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); }
    }
    .wbt-msg-bot { align-self: flex-start; }
    .wbt-msg-user { align-self: flex-end; }
    .wbt-msg-bubble {
      padding: 12px 16px; border-radius: 18px; font-size: 14px; line-height: 1.5;
      word-wrap: break-word; white-space: pre-wrap;
    }
    .wbt-msg-bot .wbt-msg-bubble {
      background: #162032; color: #e0e6ed;
      border-bottom-left-radius: 6px;
      border: 1px solid rgba(212,168,83,.1);
    }
    .wbt-msg-user .wbt-msg-bubble {
      background: linear-gradient(135deg, #d4a853, #c49a3a);
      color: #0a1628; font-weight: 500;
      border-bottom-right-radius: 6px;
    }

    .wbt-typing { align-self: flex-start; padding: 4px 0; }
    .wbt-typing-dots { display: flex; gap: 5px; padding: 14px 18px; background: #162032; border-radius: 18px; border-bottom-left-radius: 6px; border: 1px solid rgba(212,168,83,.1); }
    .wbt-typing-dots span {
      width: 8px; height: 8px; border-radius: 50%; background: #d4a853;
      animation: wbt-dotBounce 1.4s infinite;
    }
    .wbt-typing-dots span:nth-child(2) { animation-delay: .2s; }
    .wbt-typing-dots span:nth-child(3) { animation-delay: .4s; }
    @keyframes wbt-dotBounce {
      0%,60%,100%{transform:translateY(0);opacity:.4}30%{transform:translateY(-8px);opacity:1}
    }

    .wbt-input-area {
      padding: 12px 16px; background: #0a1628;
      border-top: 1px solid rgba(212,168,83,.15);
      display: flex; gap: 10px; align-items: center;
    }
    .wbt-input {
      flex: 1; border: 1px solid rgba(212,168,83,.2); background: #132238;
      border-radius: 24px; padding: 12px 18px; color: #e0e6ed;
      font-size: 14px; font-family: inherit; outline: none;
      transition: border-color .2s;
    }
    .wbt-input::placeholder { color: #556677; }
    .wbt-input:focus { border-color: rgba(212,168,83,.5); }
    .wbt-send-btn {
      width: 44px; height: 44px; border-radius: 50%; border: none; cursor: pointer;
      background: linear-gradient(135deg, #d4a853, #b8922e);
      display: flex; align-items: center; justify-content: center;
      transition: transform .15s, opacity .15s; flex-shrink: 0;
    }
    .wbt-send-btn:hover { transform: scale(1.08); }
    .wbt-send-btn:disabled { opacity: .4; cursor: default; transform: none; }
    .wbt-send-btn svg { width: 20px; height: 20px; fill: #0a1628; }

    .wbt-footer {
      padding: 8px; text-align: center; background: #0a1628;
      border-top: 1px solid rgba(212,168,83,.08);
    }
    .wbt-footer a {
      color: #556677; font-size: 11px; text-decoration: none; transition: color .2s;
    }
    .wbt-footer a:hover { color: #d4a853; }

    .wbt-quick-btns { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px; }
    .wbt-quick-btn {
      background: rgba(212,168,83,.12); border: 1px solid rgba(212,168,83,.25);
      color: #d4a853; padding: 6px 14px; border-radius: 20px; font-size: 13px;
      cursor: pointer; transition: all .2s; font-family: inherit;
    }
    .wbt-quick-btn:hover { background: rgba(212,168,83,.25); }

    @media (max-width: 480px) {
      #wbt-chat-window {
        bottom: 0; right: 0; width: 100%; max-width: 100%;
        height: 100vh; max-height: 100vh; border-radius: 0;
      }
      #wbt-chat-btn { bottom: 16px; right: 16px; width: 56px; height: 56px; }
    }
  `;

  // ── Menu Data ───────────────────────────────────────────
  const MENU = {
    fish: [
      {name:'Fish Regular', price:5.80},
      {name:'Battered Fish', price:6.20},
      {name:'Crumbed Fish', price:null, note:'Ask for price'},
      {name:'Large Fish Fillet', price:14.90},
      {name:'Tarakihi', price:15.50},
      {name:'Gurnard', price:17.20},
      {name:'Snapper', price:null, note:'Ask for price'},
    ],
    burgers: [
      {name:'Beach Burger', price:6.90},
      {name:'Beef Burger', price:7.90},
      {name:'Veggie Burger', price:8.20},
      {name:'Chicken Burger', price:8.90},
      {name:'Cheeseburger', price:8.90},
      {name:'Fish Burger', price:8.90},
      {name:'Egg Burger', price:9.90},
      {name:'Grilled Chicken Burger', price:10.20},
      {name:'Hawaiian Burger', price:10.20},
      {name:'Bacon Burger', price:10.50},
      {name:'Steak Burger', price:15.20},
      {name:'Kapiti Burger', price:null, note:'Ask for price'},
    ],
    toasties: [
      {name:'Cheese & Onion', price:5.50},
      {name:'Cheese & Pineapple', price:5.50},
      {name:'Ham & Cheese', price:6.50},
      {name:'Ham & Tomato', price:6.50},
      {name:'Ham & Pineapple', price:6.50},
      {name:'Steak Toastie', price:7.90},
      {name:'Steak & Cheese Toastie', price:8.90},
      {name:'Bacon & Egg Toastie', price:null, note:'Ask for price'},
    ],
    chips: [
      {name:'Chips (Small)', price:3.90},
      {name:'Chips (Large)', price:5.80},
      {name:'Wedges (Small)', price:4.50},
      {name:'Wedges (Large)', price:7.50},
      {name:'Kumara Chips (Small)', price:4.90},
      {name:'Kumara Chips (Large)', price:8.50},
    ],
    other: [
      {name:'Hot Dog', price:1.60},
      {name:'Potato Fritter', price:4.90},
      {name:'Spring Roll', price:5.30},
      {name:'Curry Roll', price:5.30},
      {name:'Steak & Onion Roll', price:5.30},
      {name:'Sausage', price:4.90},
      {name:'Meat Patty (Homemade)', price:4.90},
      {name:'Chicken Schnitzel', price:5.30},
      {name:'Fish Cake', price:13.50},
      {name:'Lasagne Topper', price:8.50},
      {name:'Paua Fritter', price:5.30},
      {name:'Mussel Fritter', price:5.30},
      {name:'Corn Fritter', price:5.50},
      {name:'Corn Nuggets (6)', price:2.50},
      {name:'Crab Stick', price:3.50},
      {name:'Hash Brown', price:3.00},
      {name:'Stuffed Mushroom', price:1.30},
      {name:'Mushroom', price:1.20},
      {name:'Chicken Nugget', price:1.20},
      {name:'Squid Ring', price:3.30},
      {name:'Onion Ring', price:2.30},
      {name:'Scallop', price:3.40},
      {name:'Mussel (Pacific)', price:2.50},
      {name:'Oyster (Pacific)', price:3.90},
      {name:'Pineapple Fritter', price:3.90},
      {name:'Banana Fritter', price:4.00},
    ],
    packs: [
      {name:'Kids Pack', price:9.80, desc:'Small Chips, Potato Fritter, Tomato Sauce + choice of: Hot Dog, 2 Mini Fish, 4 Nuggets, Spring Roll, or 6 Mini Spring Rolls'},
      {name:'Dinner Box – 2 Reg Fish & 2 Eggs', price:23.50, desc:'With Small Chips, Coleslaw, Lemon Slice & Tartare Sauce'},
      {name:'Dinner Box – Tarakihi', price:22.90, desc:'With Small Chips, Coleslaw, Lemon Slice & Tartare Sauce'},
      {name:'Dinner Box – Gurnard', price:23.50, desc:'With Small Chips, Coleslaw, Lemon Slice & Tartare Sauce'},
      {name:'Dinner Box – Snapper', price:25.20, desc:'With Small Chips, Coleslaw, Lemon Slice & Tartare Sauce'},
      {name:'Small Family Pack', price:47.90, desc:'4 Fish, 2 Hot Dogs, 2 Potato Fritters, 4 Chicken Nuggets & 2 Large Chips'},
      {name:'Large Family Pack', price:72.90, desc:'6 Fish, 2 Hot Dogs, 4 Potato Fritters, 6 Chicken Nuggets & 3 Large Chips'},
    ],
  };

  // Flatten all items for search
  const ALL_ITEMS = [];
  Object.values(MENU).forEach(cat => cat.forEach(item => ALL_ITEMS.push(item)));

  // ── Chat Engine ─────────────────────────────────────────
  let order = [];
  let state = 'browsing'; // browsing | confirming | waiting_time | waiting_name | done
  let pickupTime = '';

  function findItems(text) {
    const t = text.toLowerCase();
    const matches = [];
    // Check quantity prefix
    const qtyMatch = t.match(/(\d+)\s*x?\s*/);

    for (const item of ALL_ITEMS) {
      const n = item.name.toLowerCase();
      // Build search patterns
      const words = n.split(/[\s&()]+/).filter(w => w.length > 2);
      const nameSimple = n.replace(/[()&]/g,' ').replace(/\s+/g,' ');
      if (t.includes(nameSimple) || words.every(w => t.includes(w))) {
        matches.push(item);
      }
    }
    return matches;
  }

  function fmtPrice(p) { return p != null ? `$${p.toFixed(2)}` : 'Ask for price'; }
  function orderTotal() { return order.reduce((s,i) => s + (i.price||0) * i.qty, 0); }

  function formatList(items) {
    return items.map(i => `• ${i.name} — ${fmtPrice(i.price)}`).join('\n');
  }

  function getResponse(text) {
    const t = text.toLowerCase().trim();

    // State machine
    if (state === 'waiting_time') {
      const timeMatch = t.match(/\d{1,2}[:.]\d{2}|\d{1,2}\s*(pm|am|oclock|o'clock)/i) || t.match(/(lunch|dinner|soon|half\s*hour|\d+\s*min)/i);
      if (timeMatch || t.length < 20) {
        pickupTime = text;
        state = 'waiting_name';
        return `Sweet, picking up around ${text} 👍\n\nWhat name should we put the order under?`;
      }
    }

    if (state === 'waiting_name') {
      const name = text.trim();
      state = 'done';
      let summary = `✅ Order confirmed for ${name}!\n\nHere's your order:\n`;
      order.forEach(i => { summary += `• ${i.qty}x ${i.name} — ${fmtPrice(i.price * i.qty)}\n`; });
      summary += `\n💰 Total: $${orderTotal().toFixed(2)}`;
      summary += `\n⏰ Pickup: ${pickupTime}`;
      summary += `\n📍 40 Rangihiroa St, Waikanae Beach`;
      summary += `\n\nSee you soon, ${name}! 🏖️`;
      return summary;
    }

    if (state === 'done') {
      order = []; state = 'browsing'; pickupTime = '';
      return "Hey! Starting a fresh order 🐟 What can I get you?";
    }

    // Check for order completion
    if (order.length > 0 && /(that'?s?\s*(it|all)|done|finish|complete|checkout|confirm|place.*(order|it)|ready)/i.test(t)) {
      state = 'waiting_time';
      let summary = "Here's what I've got so far:\n\n";
      order.forEach(i => { summary += `• ${i.qty}x ${i.name} — ${fmtPrice(i.price * i.qty)}\n`; });
      summary += `\n💰 Total: $${orderTotal().toFixed(2)}\n\nWhat time would you like to pick up? ⏰`;
      return summary;
    }

    // Try to add items to order
    const qtyMatch = t.match(/^(\d+)\s*/);
    const qty = qtyMatch ? parseInt(qtyMatch[1]) : 1;

    // Specific item matching with fuzzy search
    let added = [];

    const patterns = [
      {rx:/fish\s*(?:and|&|n)\s*chips/i, items:[{ref:'Fish Regular'},{ref:'Chips (Small)'}]},
      {rx:/large\s*fish\s*(?:and|&|n)\s*chips/i, items:[{ref:'Large Fish Fillet'},{ref:'Chips (Large)'}]},
      {rx:/small\s*family\s*pack/i, items:[{ref:'Small Family Pack'}]},
      {rx:/large\s*family\s*pack/i, items:[{ref:'Large Family Pack'}]},
      {rx:/family\s*pack/i, items:[{ref:'Small Family Pack'}]},
      {rx:/kids?\s*pack/i, items:[{ref:'Kids Pack'}]},
      {rx:/dinner\s*box/i, items:[{ref:'Dinner Box – 2 Reg Fish & 2 Eggs'}]},
    ];

    for (const p of patterns) {
      if (p.rx.test(t)) {
        p.items.forEach(pi => {
          const found = ALL_ITEMS.find(i => i.name === pi.ref);
          if (found) added.push({...found, qty});
        });
        break;
      }
    }

    if (!added.length) {
      // Try individual item matching
      const itemPatterns = [
        {rx:/beach\s*burger/i, ref:'Beach Burger'},
        {rx:/beef\s*burger/i, ref:'Beef Burger'},
        {rx:/veggie\s*burger/i, ref:'Veggie Burger'},
        {rx:/chicken\s*burger/i, ref:'Chicken Burger'},
        {rx:/grilled\s*chicken/i, ref:'Grilled Chicken Burger'},
        {rx:/cheese\s*burger/i, ref:'Cheeseburger'},
        {rx:/fish\s*burger/i, ref:'Fish Burger'},
        {rx:/egg\s*burger/i, ref:'Egg Burger'},
        {rx:/hawaiian/i, ref:'Hawaiian Burger'},
        {rx:/bacon\s*burger/i, ref:'Bacon Burger'},
        {rx:/steak\s*burger/i, ref:'Steak Burger'},
        {rx:/kapiti\s*burger/i, ref:'Kapiti Burger'},
        {rx:/battered\s*fish/i, ref:'Battered Fish'},
        {rx:/crumbed\s*fish/i, ref:'Crumbed Fish'},
        {rx:/large\s*fish/i, ref:'Large Fish Fillet'},
        {rx:/tarakihi/i, ref:'Tarakihi'},
        {rx:/gurnard/i, ref:'Gurnard'},
        {rx:/snapper/i, ref:'Snapper'},
        {rx:/large\s*chips/i, ref:'Chips (Large)'},
        {rx:/small\s*chips/i, ref:'Chips (Small)'},
        {rx:/large\s*wedges/i, ref:'Wedges (Large)'},
        {rx:/small\s*wedges|wedges/i, ref:'Wedges (Small)'},
        {rx:/kumara/i, ref:'Kumara Chips (Small)'},
        {rx:/hot\s*dog/i, ref:'Hot Dog'},
        {rx:/spring\s*roll/i, ref:'Spring Roll'},
        {rx:/curry\s*roll/i, ref:'Curry Roll'},
        {rx:/steak.*onion.*roll/i, ref:'Steak & Onion Roll'},
        {rx:/potato\s*fritter/i, ref:'Potato Fritter'},
        {rx:/paua/i, ref:'Paua Fritter'},
        {rx:/mussel\s*fritter/i, ref:'Mussel Fritter'},
        {rx:/corn\s*fritter/i, ref:'Corn Fritter'},
        {rx:/pineapple\s*fritter/i, ref:'Pineapple Fritter'},
        {rx:/banana\s*fritter/i, ref:'Banana Fritter'},
        {rx:/chicken\s*schnitzel|schnitzel/i, ref:'Chicken Schnitzel'},
        {rx:/chicken\s*nugget/i, ref:'Chicken Nugget'},
        {rx:/corn\s*nugget/i, ref:'Corn Nuggets (6)'},
        {rx:/squid/i, ref:'Squid Ring'},
        {rx:/onion\s*ring/i, ref:'Onion Ring'},
        {rx:/scallop/i, ref:'Scallop'},
        {rx:/oyster/i, ref:'Oyster (Pacific)'},
        {rx:/hash\s*brown/i, ref:'Hash Brown'},
        {rx:/sausage/i, ref:'Sausage'},
        {rx:/meat\s*patty|patty/i, ref:'Meat Patty (Homemade)'},
        {rx:/lasagne/i, ref:'Lasagne Topper'},
        {rx:/fish\s*cake/i, ref:'Fish Cake'},
        {rx:/crab/i, ref:'Crab Stick'},
        {rx:/stuffed\s*mushroom/i, ref:'Stuffed Mushroom'},
        {rx:/mushroom/i, ref:'Mushroom'},
        {rx:/mussel(?!\s*fritter)/i, ref:'Mussel (Pacific)'},
        {rx:/ham.*cheese\s*toastie|ham\s*(?:&|and)\s*cheese/i, ref:'Ham & Cheese'},
        {rx:/steak.*cheese\s*toastie|steak\s*(?:&|and)\s*cheese/i, ref:'Steak & Cheese Toastie'},
        {rx:/cheese.*onion/i, ref:'Cheese & Onion'},
        {rx:/cheese.*pineapple/i, ref:'Cheese & Pineapple'},
        {rx:/ham.*tomato/i, ref:'Ham & Tomato'},
        {rx:/ham.*pineapple/i, ref:'Ham & Pineapple'},
        {rx:/bacon.*egg/i, ref:'Bacon & Egg Toastie'},
        {rx:/steak\s*toastie/i, ref:'Steak Toastie'},
      ];

      for (const p of itemPatterns) {
        if (p.rx.test(t)) {
          const found = ALL_ITEMS.find(i => i.name === p.ref);
          if (found) { added.push({...found, qty}); break; }
        }
      }
    }

    // If we matched items, add to order
    if (added.length) {
      added.forEach(item => {
        const existing = order.find(o => o.name === item.name);
        if (existing) existing.qty += item.qty;
        else order.push({name: item.name, price: item.price, qty: item.qty});
      });

      const addedStr = added.map(i => `${i.qty}x ${i.name}`).join(' + ');
      let resp = `Added ${addedStr} ✅\n\n🛒 Your order so far:\n`;
      order.forEach(i => { resp += `• ${i.qty}x ${i.name} — ${fmtPrice(i.price * i.qty)}\n`; });
      resp += `\n💰 Running total: $${orderTotal().toFixed(2)}`;
      resp += `\n\nAnything else? Or say "that's it" when you're ready to order!`;
      return resp;
    }

    // ── Info responses ──
    if (/(hey|hi|hello|kia\s*ora|g'?day|howdy|sup|yo|hiya)/i.test(t)) {
      return `Hey! Welcome to Waikanae Beach Takeaways 🐟

What can I get for you today? We've got:

🐠 Fresh Fish — from $5.80
🍔 Burgers — from $6.90
🧀 Toasties — from $5.50
🍟 Chips & Wedges — from $3.90
👨‍👩‍👧‍👦 Family Packs — from $47.90
🧒 Kids Packs — $9.80

Just tell me what you'd like, or ask about any part of the menu!`;
    }

    if (/(menu|what.*(?:have|got|sell|serve)|what's on|show me)/i.test(t)) {
      return `Here's what we've got! 🍽️

🐠 Fish — Regular, Battered, Crumbed, Large Fillet, Tarakihi, Gurnard, Snapper
🍔 Burgers — Beach, Beef, Veggie, Chicken, Cheese, Fish, Egg, Hawaiian, Bacon, Steak, Kapiti + more
🧀 Toasties — Cheese & Onion, Ham & Cheese, Steak & Cheese + more
🍟 Chips — Regular, Wedges, Kumara (small & large)
🥡 Other — Hot Dogs, Fritters, Rolls, Nuggets, Seafood + heaps more
📦 Packs — Kids Pack, Dinner Boxes, Family Packs

What catches your eye? 👀`;
    }

    if (/\bfish\b/i.test(t) && !/(burger|cake|chip)/i.test(t)) {
      return `🐠 Our Fish Options:\n\n${formatList(MENU.fish)}\n\nWant me to add any of these to your order?`;
    }

    if (/burger/i.test(t)) {
      return `🍔 Our Burgers:\n\n${formatList(MENU.burgers)}\n\nWhich burger takes your fancy?`;
    }

    if (/toastie|toasted/i.test(t)) {
      return `🧀 Toasties:\n\n${formatList(MENU.toasties)}\n\nWhat sounds good?`;
    }

    if (/chip|fries|wedge|kumara/i.test(t)) {
      return `🍟 Chips & Sides:\n\n${formatList(MENU.chips)}\n\nSmall or large?`;
    }

    if (/family/i.test(t)) {
      return `👨‍👩‍👧‍👦 Family Packs:\n\n• Small Family Pack — $47.90\n  ${MENU.packs.find(p=>p.name.includes('Small Family')).desc}\n\n• Large Family Pack — $72.90\n  ${MENU.packs.find(p=>p.name.includes('Large Family')).desc}\n\nWhich one would you like?`;
    }

    if (/kids?/i.test(t)) {
      const kp = MENU.packs.find(p=>p.name==='Kids Pack');
      return `🧒 Kids Pack — $9.80\n\n${kp.desc}\n\nWant me to add one?`;
    }

    if (/dinner\s*box/i.test(t)) {
      const boxes = MENU.packs.filter(p=>p.name.startsWith('Dinner'));
      return `🍽️ Dinner Boxes:\n(All come with Small Chips, Coleslaw, Lemon Slice & Tartare Sauce)\n\n${formatList(boxes)}\n\nWhich one would you like?`;
    }

    if (/(seafood|other|fritter|roll|nugget|ring|scallop|oyster|mussel|paua|squid)/i.test(t)) {
      return `🥡 Other Goodies:\n\n${formatList(MENU.other.slice(0,13))}\n\n...and more! Ask about anything specific 😊`;
    }

    if (/(price|cost|how much)/i.test(t)) {
      return "Just ask about any item and I'll give you the price! For example: \"how much is a fish burger?\" or \"fish prices\" 🤙";
    }

    if (/(hours|open|when|time.*open|closed)/i.test(t)) {
      return `🕒 Our Hours:\n\nMonday — Closed\nTuesday — 11:30am-2pm & 4-8pm\nWednesday — Closed\nThursday — 11:30am-2pm & 4-8pm\nFriday — 11:30am-2pm & 4-8pm\nSaturday — 12-3pm & 4-8pm\nSunday — 12-3pm & 4-8pm`;
    }

    if (/(where|address|location|find you|directions)/i.test(t)) {
      return "📍 We're at 40 Rangihiroa Street, Waikanae Beach — right by the beach! Can't miss us 🏖️";
    }

    if (/(phone|call|number|ring)/i.test(t)) {
      return "📞 Give us a bell on 042 938 332!";
    }

    if (/(thank|cheers|ta|legend|awesome|sweet as)/i.test(t)) {
      return "No worries! 🤙 Anything else I can help with?";
    }

    if (order.length > 0) {
      return `Hmm, not sure about that one! 🤔\n\nYour current order:\n${order.map(i=>`• ${i.qty}x ${i.name}`).join('\n')}\n\n💰 Total: $${orderTotal().toFixed(2)}\n\nYou can add more items, ask about the menu, or say "that's it" to confirm!`;
    }

    return `Not sure I caught that! 🤔\n\nTry things like:\n• "2 fish and chips"\n• "show me the burgers"\n• "what fish do you have?"\n• "large family pack"\n\nOr just say "menu" to see everything! 🍽️`;
  }

  // ── UI ──────────────────────────────────────────────────
  function init() {
    // Inject styles
    const style = document.createElement('style');
    style.textContent = CSS;
    document.head.appendChild(style);

    // Chat button
    const btn = document.createElement('button');
    btn.id = 'wbt-chat-btn';
    btn.setAttribute('aria-label','Open chat');
    btn.innerHTML = `<svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12z"/><path d="M7 9h2v2H7zm4 0h2v2h-2zm4 0h2v2h-2z"/></svg>`;
    const badge = document.createElement('span');
    badge.className = 'wbt-badge';
    badge.textContent = '1';
    btn.appendChild(badge);
    document.body.appendChild(btn);

    // Chat window
    const win = document.createElement('div');
    win.id = 'wbt-chat-window';
    win.innerHTML = `
      <div class="wbt-header">
        <div class="wbt-header-avatar">🐟</div>
        <div class="wbt-header-info">
          <h3>Waikanae Beach Takeaways</h3>
          <p>● Online — ready to take your order</p>
        </div>
        <button class="wbt-close-btn" aria-label="Close chat">
          <svg viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
        </button>
      </div>
      <div class="wbt-messages"></div>
      <div class="wbt-input-area">
        <input class="wbt-input" placeholder="Type your order or ask about the menu..." autocomplete="off" />
        <button class="wbt-send-btn" aria-label="Send" disabled>
          <svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
        </button>
      </div>
      <div class="wbt-footer">
        <a href="https://wingfieldgemini.com" target="_blank" rel="noopener">⚡ Powered by WingfieldGemini</a>
      </div>
    `;
    document.body.appendChild(win);

    const messagesEl = win.querySelector('.wbt-messages');
    const inputEl = win.querySelector('.wbt-input');
    const sendBtn = win.querySelector('.wbt-send-btn');
    const closeBtn = win.querySelector('.wbt-close-btn');
    let isOpen = false;

    function toggleChat() {
      isOpen = !isOpen;
      win.classList.toggle('wbt-open', isOpen);
      btn.style.display = isOpen ? 'none' : 'flex';
      if (isOpen) {
        badge.style.display = 'none';
        if (!messagesEl.children.length) showGreeting();
        setTimeout(() => inputEl.focus(), 400);
      }
    }

    btn.onclick = toggleChat;
    closeBtn.onclick = toggleChat;

    function addMsg(text, sender, quickBtns) {
      const div = document.createElement('div');
      div.className = `wbt-msg wbt-msg-${sender}`;
      const bubble = document.createElement('div');
      bubble.className = 'wbt-msg-bubble';
      bubble.textContent = text;
      div.appendChild(bubble);

      if (quickBtns && quickBtns.length) {
        const btnsDiv = document.createElement('div');
        btnsDiv.className = 'wbt-quick-btns';
        quickBtns.forEach(b => {
          const qb = document.createElement('button');
          qb.className = 'wbt-quick-btn';
          qb.textContent = b;
          qb.onclick = () => { sendMessage(b); btnsDiv.remove(); };
          btnsDiv.appendChild(qb);
        });
        div.appendChild(btnsDiv);
      }

      messagesEl.appendChild(div);
      messagesEl.scrollTop = messagesEl.scrollHeight;
    }

    function showTyping() {
      const div = document.createElement('div');
      div.className = 'wbt-typing';
      div.innerHTML = '<div class="wbt-typing-dots"><span></span><span></span><span></span></div>';
      messagesEl.appendChild(div);
      messagesEl.scrollTop = messagesEl.scrollHeight;
      return div;
    }

    function showGreeting() {
      const typing = showTyping();
      setTimeout(() => {
        typing.remove();
        addMsg(
          "Hey! Welcome to Waikanae Beach Takeaways 🐟\n\nWhat can I get for you today?",
          'bot',
          ['View Menu', 'Fish & Chips', 'Burgers', 'Family Packs']
        );
      }, 800);
    }

    function sendMessage(text) {
      if (!text.trim()) return;
      addMsg(text, 'user');
      inputEl.value = '';
      sendBtn.disabled = true;

      const typing = showTyping();
      const delay = 400 + Math.random() * 800;
      setTimeout(() => {
        typing.remove();
        const resp = getResponse(text);
        const btns = [];
        if (order.length > 0 && state === 'browsing') btns.push("That's it — place order");
        if (state === 'browsing' && !order.length) {
          if (/menu|welcome|got/i.test(resp)) btns.push('Fish', 'Burgers', 'Chips');
        }
        addMsg(resp, 'bot', btns);
      }, delay);
    }

    inputEl.addEventListener('input', () => { sendBtn.disabled = !inputEl.value.trim(); });
    inputEl.addEventListener('keydown', e => { if (e.key === 'Enter') sendMessage(inputEl.value); });
    sendBtn.addEventListener('click', () => sendMessage(inputEl.value));
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
