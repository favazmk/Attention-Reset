/**
 * The Deep Work System — the paid material, server-side only.
 *
 * This file is deliberately under `api/`. It used to sit in `src/`, where the
 * bundler turned it into a chunk — and a chunk is a public URL, so the entire
 * ₹1000 programme was fetchable by anyone who read the module graph. Nothing
 * here is ever sent to the browser except through `/api/deepwork-content`,
 * which checks the entitlement first.
 *
 * What a buyer is *told* they get still lives client-side in
 * `src/pages/deepwork/outline.js`, because the offer screen has to render it
 * before anyone has bought anything. A test asserts the two agree, so the offer
 * can never promise a week or a day count this file does not deliver.
 *
 * Field-key convention: every stored answer is prefixed `dw_`, so this
 * programme's progress shares the existing `data` bag with the 7-day reset
 * without any chance of a key collision.
 *
 * A note on claims: nothing here cites a statistic or a study. The reasoning in
 * each `why` is argument, not evidence — that is deliberate, so no line in this
 * product asserts something that can't be stood behind.
 */

export const WEEKS = [
  {
    n: 1,
    key: 'w1',
    color: '#00E5C0',
    title: 'The Long Sprint',
    promise:
      'Find out how long you can actually hold a hard problem — then extend it.',
    pattern: 'day5',
    shift: {
      from: 'Removing what interrupts you',
      to: 'Building the endurance to stay',
    },
    why: [
      'The reset cleared the interference. That is not the same as being able to concentrate for a long time — it only means nothing is stopping you.',
      'Focus behaves like a capacity, not a mood. You do not get more of it by wanting it more. You get it the way you get any capacity: a load slightly beyond what is comfortable, repeated, and honestly recorded.',
      'This week you find your real ceiling and push against it. Most people discover it is lower than they assumed and rises faster than they expected.',
    ],
    practice: {
      heading: 'One block a day, getting longer',
      intro:
        'One task per block. Phone in another room. When the timer ends, stop — even mid-sentence. Stopping on time is what makes tomorrow’s block possible.',
      days: [
        '25 minutes — one task, no switching',
        '30 minutes — same task type, note the moment it got hard',
        '40 minutes — start before you check anything',
        '45 minutes — no notes app, no “quick look”',
        '55 minutes — hardest task of the day goes here',
        '70 minutes — one break allowed, standing, no screen',
        '90 minutes — the full block',
      ],
    },
    reflect: [
      {
        id: 'dw_w1_break',
        label: 'Which minute did it get hard?',
        placeholder: 'e.g., around minute 18, every time',
        lines: 1,
      },
      {
        id: 'dw_w1_reach',
        label: 'What did you reach for when it did?',
        placeholder: 'e.g., my phone, or a second tab I did not need',
        lines: 2,
      },
      {
        id: 'dw_w1_ceiling',
        label: 'The longest block you completed cleanly this week',
        placeholder: 'e.g., 55 minutes',
        lines: 1,
      },
    ],
    close:
      'You now know your real ceiling instead of guessing at it. Next week stops treating that block as something you squeeze in, and starts building the week around it.',
  
  },

  {
    n: 2,
    key: 'w2',
    color: '#B060FF',
    title: 'The Weekly Architecture',
    promise:
      'Stop defending a day. Design a week.',
    pattern: 'day2',
    shift: {
      from: 'Protecting today from interruption',
      to: 'Placing the work before the week fills up',
    },
    why: [
      'A day is too small a unit to protect. Something urgent lands in it, the block is the only flexible thing in there, and the block loses. That is not a discipline failure — it is a scheduling one.',
      'A week has slack a day does not. If the deep blocks go in first, the urgent things arrange themselves around the blocks instead of on top of them.',
      'The order is the whole trick: blocks first, then everything else. Reverse it and you are back to hoping for a gap.',
    ],
    practice: {
      heading: 'Blocks first, then the rest',
      intro:
        'On day one, open your calendar and place next week’s deep blocks before anything else goes in. Then defend them. When one moves, you log why — that log is the actual output of this week.',
      days: [
        'Placed next week’s deep blocks in the calendar — before anything else',
        'Defended the block. Logged it if it moved',
        'Said no to one thing that wanted the block',
        'Started the block within 5 minutes of its start time',
        'Ended the block on time instead of drifting past it',
        'Moved a block deliberately rather than losing it',
        'Placed the following week’s blocks without being reminded',
      ],
    },
    reflect: [
      {
        id: 'dw_w2_moved',
        label: 'What moved a block this week — and was it genuinely urgent?',
        placeholder: 'Be honest. Most of them are not.',
        lines: 3,
      },
      {
        id: 'dw_w2_window',
        label: 'Your non-negotiable deep window is',
        placeholder: 'e.g., Tue/Thu 7:00–8:30am, before anyone else is awake',
        lines: 1,
      },
    ],
    close:
      'The block now has a place in the week rather than competing for one. Week three deals with the harder half of attention: not what interrupts you, but what you go looking for.',
  
  },

  {
    n: 3,
    key: 'w3',
    color: '#F5C842',
    title: 'The Input Diet',
    promise:
      'The reset silenced what arrives. This controls what you go and get.',
    pattern: 'day4',
    shift: {
      from: 'Blocking interruption',
      to: 'Choosing your intake on purpose',
    },
    why: [
      'The reset dealt with attention taken from you — notifications, pings, autoplay. It did not touch attention you hand over voluntarily.',
      'Most of it is voluntary. The feed you open without deciding to. The tab kept "for later". The second screen during dinner. Nothing interrupted you; you went and got it.',
      'Cutting interruption without cutting intake leaves your attention just as fragmented, only more politely. This week the rules are cumulative — each one stays on for the rest of the week.',
    ],
    practice: {
      heading: 'One rule a day, and it stays on',
      intro:
        'Add one rule per day and keep every previous one running. By day seven you are holding all of them at once. If you break one, you do not start over — you note it and carry on.',
      days: [
        'No feeds before the first deep block',
        'News and messages at one set time only',
        'One long thing read per day — a chapter, a paper, a full article',
        'No second screen while eating',
        'Every "for later" tab either read, saved properly, or closed',
        'One waking hour with no input at all',
        'All six rules held together for a full day',
      ],
    },
    reflect: [
      {
        id: 'dw_w3_hardest',
        label: 'Which input was hardest to give up?',
        placeholder: 'e.g., the news check — it felt like being uninformed',
        lines: 2,
      },
      {
        id: 'dw_w3_instead',
        label: 'What did you do with the time instead?',
        placeholder: 'e.g., actually finished the book I have been carrying for a year',
        lines: 2,
      },
      {
        id: 'dw_w3_keep',
        label: 'Which of the six rules are you keeping permanently?',
        placeholder: 'Name the ones that earned their place.',
        lines: 2,
      },
    ],
    close:
      'Three weeks of doing this on purpose. The last week is about what happens when you stop paying attention to it — because eventually you will.',
  
  },

  {
    n: 4,
    key: 'w4',
    color: '#FF8C00',
    title: 'The Self-Running System',
    promise:
      'Make it survive a bad week.',
    pattern: 'day7',
    shift: {
      from: 'Running the system deliberately',
      to: 'The system running without your attention',
    },
    why: [
      'Everything so far has taken intent. Intent is the first thing to go when you are ill, travelling, behind, or having a genuinely bad month.',
      'A system that only works while you are watching it is not finished. What makes it durable is not more willpower — it is a written protocol you can follow on the day you have none.',
      'So this week you write two things down: the review that keeps it honest, and the protocol for the week you miss. Both live outside your head, which is the point.',
    ],
    practice: {
      heading: 'Write it down so it outlives your motivation',
      intro:
        'This week produces documents, not just ticks. What you write in the reflections below is the actual deliverable — it is what you keep after the four weeks end.',
      days: [
        'Wrote the weekly review ritual — 10 minutes, same slot every week',
        'Ran the review once, start to finish',
        'Wrote the relapse protocol for the week you miss everything',
        'Deliberately had a bad day and followed the protocol instead of abandoning it',
        'Set the defaults — phone location, calendar blocks, intake rules — so none needs remembering',
        'Told one person what your deep window is, so it exists outside your own head',
        'Ran a full week on defaults alone, without deciding anything',
      ],
    },
    reflect: [
      {
        id: 'dw_w4_review',
        label: 'Your weekly review ritual — when, where, and what you check',
        placeholder:
          'e.g., Sunday 6pm, kitchen table, 10 min: did the blocks hold, what moved them, place next week',
        lines: 4,
      },
      {
        id: 'dw_w4_relapse',
        label: 'Your relapse protocol — what you do the week it all falls apart',
        placeholder:
          'e.g., drop to one 25-minute block a day, keep only the no-feeds-before-first-block rule, restart properly on Monday',
        lines: 4,
      },
      {
        id: 'dw_w4_defaults',
        label: 'The defaults that now run without you',
        placeholder: 'e.g., phone charges in the hall, blocks are recurring calendar events',
        lines: 3,
      },
    ],
    close:
      'You have a system that does not depend on you feeling like it. That is the whole thing.',
  
  },
];
