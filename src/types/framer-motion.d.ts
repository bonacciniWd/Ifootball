import { HTMLMotionProps } from 'framer-motion';

declare module 'framer-motion' {
  interface MotionProps extends HTMLMotionProps<any> {
    whileInView?: any;
    viewport?: any;
  }
}
