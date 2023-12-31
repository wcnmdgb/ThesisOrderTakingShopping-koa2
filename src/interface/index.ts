export interface tradeInterFace {
    id: number;
    name: string;
    desc: string;
    image: string;
    money: number;
    create_time: string;
    update_time: string;
    status: number;
    product_type_id: number;
    product_type: Product_type | string;
    value: number;
    checked: Boolean;
}
export interface Product_type {
    label: string;
}


