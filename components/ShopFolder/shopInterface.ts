export interface ShopBundleConfiguratorProps {
  bundle: BundleConfig;
  onClose: () => void;
  onRequestQuote?: (payload: RequestQuotePayload) => void;
}
type BundleItem = {
  id: string;
  name: string;
  price: number;
  image?: string;
  description?: string;
};

export type BundleConfig = {
  name: string;
  basePrice: number;
  maxItems: number;
  icon?: string;
  items: BundleItem[];
};

export type RequestQuotePayload = {
  name: string;
  phone: string;
  email: string;
  selected: string[];
  total: number;
  bundle: string;
};

type BundlePiece = {
  id: string | number;
  name: string;
};

type Bundle = {
  icon: string;
  name: string;
  blurb: string;
  basePrice: number | string;
  maxItems: number;
  items: BundleItem[];
};

export interface ShopCardsProps {
  bundle: BundlePieces;
  onSelect: () => void;
}

export type ShopConfirmationModalProps = {
  onClose?: () => void;
};

type BundlePieces = { name: string; items: BundlePiece[] };
export type ShopFormProps = {
  bundle: BundleConfig;
  selectedIds: string[];
  total: number;
  onSuccess?: (payload: {
    name: string;
    phone: string;
    email: string;
    selected: string[];
    total: number;
  }) => void;
};
