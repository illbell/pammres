// The membership profile steps, in order (/member/apply/1..4).
export const profileSteps = [
  { title: 'Personal information', summary: 'Name, address, institution and education.' },
  { title: 'Most recent published research', summary: 'Title, year, publisher and design.' },
  {
    title: 'Unpublished research & interests',
    summary: 'Unpublished work, research interests, experience and your 2x2 photo.',
  },
  {
    title: 'Category & payment',
    summary: 'Choose your category, then enter your payment reference and upload the receipt.',
  },
] as const
