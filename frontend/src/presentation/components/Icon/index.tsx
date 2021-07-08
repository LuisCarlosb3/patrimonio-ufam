import React from 'react';
import iconPath from '../../styles/Icons/iconsLib';

const defaultStyles = { display: 'inline-block', verticalAlign: 'middle' };

interface IconProps {
  size?: number;
  color?: string;
  icon:
    | 'home'
    | 'search'
    | 'report'
    | 'arrowRight'
    | 'arrowDown'
    | 'user'
    | 'link'
    | 'document';
  className?: string;
  viewBox?: string;
  stroke?: number;
}

const Icon: React.FC<IconProps> = ({
  size,
  color,
  icon,
  className,
  stroke,
}) => {
  const styles = { ...defaultStyles };

  return (
    <svg
      className={className}
      style={styles}
      viewBox="0 0 24 24"
      width={`${size}px`}
      height={`${size}px`}
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      strokeWidth={stroke}
    >
      {JSON.parse(iconPath[icon]).map((item: string) => {
        return <path key={item} stroke={color} fill="none" d={item} />;
      })}
    </svg>
  );
};

Icon.defaultProps = {
  size: 16,
  color: '#000',
  viewBox: '0 0 24 24',
  className: '',
};

export default Icon;
