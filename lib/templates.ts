export const authFlowSchema = {
    "nodes": [
        {
            "id": "screen_start",
            "type": "screenNode",
            "position": { "x": 100, "y": 100 },
            "data": { "label": "Social Login Screen" }
        },
        {
            "id": "decision_sso",
            "type": "decisionNode",
            "position": { "x": 350, "y": 100 },
            "data": { "label": "Has SSO Token?" }
        },
        {
            "id": "screen_register",
            "type": "screenNode",
            "position": { "x": 350, "y": 300 },
            "data": { "label": "Email Registration" }
        },
        {
            "id": "screen_dashboard",
            "type": "terminalNode",
            "position": { "x": 700, "y": 100 },
            "data": { "label": "User Dashboard" }
        }
    ],
    "edges": [
        {
            "id": "e_start_sso",
            "source": "screen_start",
            "target": "decision_sso",
            "sourceHandle": "right-source",
            "targetHandle": "left-target"
        },
        {
            "id": "e_sso_dash",
            "source": "decision_sso",
            "target": "screen_dashboard",
            "sourceHandle": "right-source",
            "targetHandle": "left-target",
            "label": "Yes"
        },
        {
            "id": "e_sso_reg",
            "source": "decision_sso",
            "target": "screen_register",
            "sourceHandle": "bottom-source",
            "targetHandle": "left-target",
            "label": "No"
        },
        {
            "id": "e_reg_dash",
            "source": "screen_register",
            "target": "screen_dashboard",
            "sourceHandle": "right-source",
            "targetHandle": "bottom-target"
        }
    ]
};

export const checkoutFlowSchema = {
    "nodes": [
        {
            "id": "screen_cart",
            "type": "screenNode",
            "position": { "x": 100, "y": 200 },
            "data": { "label": "Shopping Cart" }
        },
        {
            "id": "screen_address",
            "type": "screenNode",
            "position": { "x": 350, "y": 200 },
            "data": { "label": "Shipping Address" }
        },
        {
            "id": "screen_payment",
            "type": "screenNode",
            "position": { "x": 600, "y": 200 },
            "data": { "label": "Payment Details" }
        },
        {
            "id": "decision_auth",
            "type": "decisionNode",
            "position": { "x": 600, "y": 400 },
            "data": { "label": "Bank 3D Auth?" }
        },
        {
            "id": "screen_success",
            "type": "terminalNode",
            "position": { "x": 900, "y": 200 },
            "data": { "label": "Order Confirmed" }
        }
    ],
    "edges": [
        { "id": "e1", "source": "screen_cart", "target": "screen_address", "sourceHandle": "right-source", "targetHandle": "left-target" },
        { "id": "e2", "source": "screen_address", "target": "screen_payment", "sourceHandle": "right-source", "targetHandle": "left-target" },
        { "id": "e3", "source": "screen_payment", "target": "decision_auth", "sourceHandle": "bottom-source", "targetHandle": "top-target" },
        { "id": "e4", "source": "decision_auth", "target": "screen_success", "sourceHandle": "right-source", "targetHandle": "bottom-target" }
    ]
};

export const brokenDemoFlowSchema = {
    "nodes": [
        {
            "id": "screen_1",
            "type": "screenNode",
            "position": { "x": 100, "y": 150 },
            "data": { "label": "Checkout Base" }
        },
        {
            "id": "screen_2",
            "type": "screenNode",
            "position": { "x": 350, "y": 150 },
            "data": { "label": "Enter Credit Card" }
        },
        {
            "id": "decision_1",
            "type": "decisionNode",
            "position": { "x": 600, "y": 150 },
            "data": { "label": "Card Rejected?" }
        },
        {
            "id": "screen_3",
            "type": "terminalNode",
            "position": { "x": 900, "y": 150 },
            "data": { "label": "Thank You Page" }
        }
    ],
    "edges": [
        { "id": "eb1", "source": "screen_1", "target": "screen_2", "sourceHandle": "right-source", "targetHandle": "left-target" },
        { "id": "eb2", "source": "screen_2", "target": "decision_1", "sourceHandle": "right-source", "targetHandle": "left-target" },
        { "id": "eb3", "source": "decision_1", "target": "screen_3", "sourceHandle": "right-source", "targetHandle": "left-target" },
        { "id": "eb_loop", "source": "decision_1", "target": "screen_2", "sourceHandle": "left-source", "targetHandle": "top-target" }
    ]
};
