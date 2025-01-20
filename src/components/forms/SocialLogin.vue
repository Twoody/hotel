User should be able to register/login from multiple places
<template>
	<div class="social-login-wrapper">
		<GoogleLogin class="login-option" />
			
		<!-- * @warning facebook authentiacation is currently blocked until a Buiness Number is sent in -->
		<!-- <FacebookLogin class="login-option" /> -->
	</div>
</template>

<script>
import GoogleLogin from "@/components/buttons/login/GoogleLogin"

export default {
	name: "SocialLogin",
	components: 
	{
		GoogleLogin,
	},
}
</script>

<style lang='less'>
.social-login-wrapper {
	align-content: center;
	align-items: center;
	display: flex;
	flex-wrap: nowrap;
	gap: 10px;
	justify-content: center;

	.login-option {
		.social-button {
			background: white;
			border: 0;
			border-radius: 100%;
			box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0,2);
			outline: 0;
			padding: 10px;
			width: 75px;
			.svg-wrapper {
				height: 100%;
				width: 100%;
			}
		}
		.social-button:active {
			box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
			display: relative;
		}
		.social-button img {
			width: 100%;
		}
	}
}
</style>
