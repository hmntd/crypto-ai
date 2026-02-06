import type { SVGAttributes } from 'react';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        <svg
            {...props}
            viewBox="0 0 400 220"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
        >
            <path
                d="
                    M 20 135
                    C 40 100, 110 85, 200 95
                    H 265
                    L 310 70
                    L 355 95
                    L 310 120
                    H 275
                    C 260 155, 210 170, 150 165
                    H 95
                    C 65 190, 35 175, 20 155
                    C 10 145, 10 140, 20 135
                    Z

                    M 105 165
                    C 100 200, 125 215, 155 205
                    C 180 190, 175 170, 145 165
                    Z

                    M 190 165
                    C 185 200, 210 215, 240 205
                    C 265 190, 260 170, 230 165
                    Z

                    M 270 155
                    C 265 185, 290 200, 315 190
                    C 335 175, 325 160, 300 155
                    Z
                "
                fill="currentColor"
                fillRule="evenodd"
            />
        </svg>
    );
}
