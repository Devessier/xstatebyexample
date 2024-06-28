type Props = {
  children: React.ReactNode;
  className?: string;
};

export default function Header({ ...props }: Props) {
  return <header {...props}>{props.children}</header>;
}
