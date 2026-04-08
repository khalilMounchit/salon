export type Service = {
  id: string;
  name: string;
  duration: number;
  category: string;
  popular?: boolean;
  quick?: boolean;
  image?: string;
};

export type Category = {
  title: string;
  subtitle: string;
  image?: string;
  icon?: string;
};