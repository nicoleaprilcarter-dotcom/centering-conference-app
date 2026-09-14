// A soft, organic decorative blob — purely visual, never sits under
// text or controls. Place inside a `position: relative` container.
export default function Flourish({ color = '#FFDCEF', size = 220, top, right, bottom, left, opacity = 1, rotate = 0 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      style={{
        position: 'absolute',
        top,
        right,
        bottom,
        left,
        opacity,
        transform: `rotate(${rotate}deg)`,
        pointerEvents: 'none',
        zIndex: 0,
      }}
      aria-hidden="true"
    >
      <path
        fill={color}
        transform="translate(100 100) scale(0.62)"
        d="M64.2,-73.4C81.6,-63.6,93.9,-43.7,97.4,-22.7C100.9,-1.7,95.6,20.4,84.6,38.6C73.6,56.8,56.9,71.1,37.8,79.5C18.7,87.9,-2.8,90.4,-23.1,85.5C-43.4,80.6,-62.5,68.3,-75.1,50.9C-87.7,33.5,-93.8,11,-90.7,-9.8C-87.6,-30.6,-75.3,-49.7,-59.1,-59.9C-42.9,-70.1,-21.5,-71.4,0.5,-72C22.4,-72.6,46.8,-83.2,64.2,-73.4Z"
      />
    </svg>
  );
}
