declare namespace JSX {
  interface IntrinsicElements {
    'l-metronome': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
      size?: string;
      speed?: string;
      color?: string;
    };
  }
}