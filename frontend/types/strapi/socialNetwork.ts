export type SocialNetwork = {
    id: number;
    name: string;
    icon: string;
    url: string;
    visible: boolean;
}

export type SocialNetworkResponse = {
    id: number;
    items: SocialNetwork[];
}