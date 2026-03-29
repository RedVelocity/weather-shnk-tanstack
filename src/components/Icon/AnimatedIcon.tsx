import * as motion from 'motion/react-m';

type AnimatedIconProps = {
  className?: string;
  icon: string;
  size: number;
  alt: string;
};
const AnimatedIcon = ({ className, icon, size, alt }: AnimatedIconProps) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, scale: 1.2 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5 }}
    key={icon}
  >
    <img src={icon} height={size} width={size} alt={alt} loading="eager" />
  </motion.div>
);

export default AnimatedIcon;
