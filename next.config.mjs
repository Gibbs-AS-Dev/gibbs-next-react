/** @type {import('next').NextConfig} */
const config = {
	experimental: {
		esmExternals: true, 
	},
	eslint: {
		ignoreDuringBuilds: true,
	},
};

export default config;
