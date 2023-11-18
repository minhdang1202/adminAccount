export interface OptionItem {
  id: string;
  username: string;
  avatar?: string;
  name?: string;
}

export interface Props {
  onChange: (value: string) => void;
  dataOptions: OptionItem[];
  placeholder?: string;
  loadMoreData?: () => void;
  loading?: boolean;
  setLoading?: (value: boolean) => void;
  hasMore?: boolean;
  labelAll?: string;
  value?: string;
}
