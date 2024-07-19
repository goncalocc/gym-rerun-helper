const getItemColor = (text: string) => {
  const warningColor: { [key: string]: string } = {
    'air balloon': 'bg-red-400',
    'focus sash': 'bg-yellow-300',
    'sturdy': 'bg-yellow-300',
    'choice scarf': 'bg-cyan-400',
    'flash fire': 'bg-red-600',
    'dry skin': 'bg-blue-500',
    'storm drain': 'bg-blue-500',
    'water absorb': 'bg-blue-500',
    'wonder guard': 'bg-fuchsia-600',
    'multiscale': 'bg-green-500',
    'pressure': 'bg-violet-700',
    'drizzle': 'bg-blue-700',
    'drought': 'bg-orange-600',
    'sand stream': 'bg-amber-800',
    'snow warning': 'bg-teal-300',
  };
  if(text) {
    return warningColor[text.toLowerCase()] || 'bg-white';
  }
};

export default getItemColor;
