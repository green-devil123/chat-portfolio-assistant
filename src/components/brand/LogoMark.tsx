type LogoMarkProps = {
  size?: number;
  className?: string;
};

const CUT_SMALL =
  'polygon(0 5px, 5px 0, calc(100% - 5px) 0, 100% 5px, 100% calc(100% - 5px), calc(100% - 5px) 100%, 5px 100%, 0 calc(100% - 5px))';

const CUT_IMG =
  'polygon(0 4px, 4px 0, calc(100% - 4px) 0, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0 calc(100% - 4px))';

export function LogoMark({ size = 56, className = '' }: LogoMarkProps) {
  return (
    <div
      className={`relative shrink-0 ${className}`}
      style={{ width: size, height: size, clipPath: CUT_SMALL }}
    >
      <div className="absolute inset-0 bg-gold/75" aria-hidden="true" />
      <img
        src="/logo.svg"
        alt=""
        width={size}
        height={size}
        className="absolute inset-[2px] h-[calc(100%-4px)] w-[calc(100%-4px)] object-cover"
        style={{ clipPath: CUT_IMG }}
      />
    </div>
  );
}
