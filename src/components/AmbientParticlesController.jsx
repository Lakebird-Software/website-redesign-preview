import { useEffect, useState } from 'react';
import Particles from './Particles.jsx';

/** Keeps the supplied React Bits animation unchanged, pausing it only while
 * the visitor is in the Hero or footer so hidden frames do not waste GPU time. */
export default function AmbientParticlesController(props) {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const update = () => setEnabled(root.classList.contains('ambient-particles-active'));
    update();
    const observer = new MutationObserver(update);
    observer.observe(root, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  return <Particles {...props} paused={!enabled} />;
}
