import { motion, useReducedMotion } from 'framer-motion';
import Container from './Container.jsx';
import SectionHeading from '../ui/SectionHeading.jsx';

export default function Section({ id, title, titleBn, eyebrow, className = '', children }) {
  const reduceMotion = useReducedMotion();

  return (
    <section id={id} className={`scroll-mt-20 py-20 sm:py-24 ${className}`}>
      <Container>
        {title && <SectionHeading title={title} titleBn={titleBn} eyebrow={eyebrow} />}
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          {children}
        </motion.div>
      </Container>
    </section>
  );
}
