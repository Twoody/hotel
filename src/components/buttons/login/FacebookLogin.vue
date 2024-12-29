<template>
	<SocialLogin provider="facebook" />
</template>

<script>
import SocialLogin from "@/components/buttons/login/SocialLogin.vue"

export default {
	name: "FacebookLogin",
	components: {
		SocialLogin,
	},
}
</script>
