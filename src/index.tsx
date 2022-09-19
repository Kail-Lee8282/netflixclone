import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider, createGlobalStyle } from "styled-components";
import App from './App';
import { theme } from "./theme";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import {ReactQueryDevtools} from "@tanstack/react-query-devtools";
import { RecoilRoot } from 'recoil';

const root = ReactDOM.createRoot(
	document.getElementById('root') as HTMLElement
);

const GlobalStyle = createGlobalStyle`
  //@import url("https://meyerweb.com/eric/tools/css/reset/reset200802.css");
  @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR&display=swap');

  html, body, div, span, applet, object, iframe,
h1, h2, h3, h4, h5, h6, p, blockquote, pre,
a, abbr, acronym, address, big, cite, code,
del, dfn, em, font, img, ins, kbd, q, s, samp,
small, strike, strong, sub, sup, tt, var,
b, u, i, center,
dl, dt, dd, ol, ul, li,
fieldset, form, label, legend,
table, caption, tbody, tfoot, thead, tr, th, td {
	margin: 0;
	padding: 0;
	border: 0;
	outline: 0;
	font-size: 100%;
	vertical-align: baseline;
	background: transparent;
}
body {
	line-height: 1;
}
ol, ul {
	list-style: none;
}
blockquote, q {
	quotes: none;
}
blockquote:before, blockquote:after,
q:before, q:after {
	content: '';
	content: none;
}

/* remember to define focus styles! */
:focus {
	outline: 0;
}

/* remember to highlight inserts somehow! */
ins {
	text-decoration: none;
}
del {
	text-decoration: line-through;
}

/* tables still need 'cellspacing="0"' in the markup */
table {
	border-collapse: collapse;
	border-spacing: 0;
}

*{
	box-sizing: border-box;
	user-select: none;
}
body{
	font-family: 'Noto Sans KR', sans-serif;	
	color:${prop=>prop.theme.white.darker};
	line-height: 1.2;
	background-color: black;
	-ms-overflow-style: none;
	scrollbar-width: none;
	&::-webkit-scrollbar{
		display: none;
	}
}
a {
	text-decoration: none;
}
`

const client = new QueryClient();

root.render(
	<React.StrictMode>
		<RecoilRoot>
			<QueryClientProvider client={client}>
				<ThemeProvider theme={theme}>
					<GlobalStyle />
					<App />
				</ThemeProvider>
				<ReactQueryDevtools/>
			</QueryClientProvider>
		</RecoilRoot>
	</React.StrictMode>
);
